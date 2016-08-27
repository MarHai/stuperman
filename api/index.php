<?php

require_once('../vendor/autoload.php');
require_once('./config.php');
require_once('./i18n.php');

$oApp = new \Slim\App();
$oApp->add(new \Bairwell\MiddlewareCors([
    'origin' => '*',
    'allowHeaders' => [ 'Content-type', 'X-Grader-Authorization' ],
    'allowMethods' => [ 'GET', 'POST', 'PUT', 'DELETE' ]
]));
$oDb = NULL;
$nUseId = NULL;
$bAdmin = FALSE;
$aCacheForeignKey = [];
$aCacheChildren = [];
$aCacheColumn = [];


/**
 * Retrieve everything. Everything (that is allowed for the current user, but without admin exceptions).
 */
$oApp->get('/all', function($_oRequest, Psr\Http\Message\ResponseInterface $_oResponse, array $_aArg) {
    if(login($_oRequest)) {
        $aData = [];
        $sSql = 'SELECT `table_name` AS sTable FROM information_schema.`tables` WHERE `TABLE_SCHEMA` = \''.DB_NAME.'\'';
        if(($oResult = query($sSql))) {
            if($oResult->num_rows > 0) {
                global $bAdmin;
                while(($aRow = $oResult->fetch_assoc())) {
                    if($aRow['sTable'] == 'user' && $bAdmin === TRUE) {
                        $aData['user'] = get('user', NULL, FALSE, TRUE);
                    } else {
                        $aData[$aRow['sTable']] = get($aRow['sTable']);
                    }
                }
            }
        }
        return $_oResponse->write(json($aData));
    }
    return $_oResponse->withStatus(405)->write('Method not allowed for current user.');
});

/**
 * Retrieve all unarchived entries from a table.
 */
$oApp->get('/{sTable}', function($_oRequest, Psr\Http\Message\ResponseInterface $_oResponse, array $_aArg) {
    if(login($_oRequest)) {
        return $_oResponse->write(json(get($_aArg['sTable'])));
    }
    return $_oResponse->withStatus(405)->write('Method not allowed for current user.');
});

/**
 * Retrieve a single instance of any table or a sublist based on a given WHERE part.
 */
$oApp->get('/{sTable}/{mWhere}', function($_oRequest, Psr\Http\Message\ResponseInterface $_oResponse, array $_aArg) {
    if(login($_oRequest)) {
        if(preg_match('/^[1-9]\d*$/', $_aArg['mWhere']) === 1) {
            return $_oResponse->write(json(get($_aArg['sTable'], intval($_aArg['mWhere']))));
        } else {
            $aWhere = [];
            foreach(explode('_', trim((string)$_aArg['mWhere'])) as $sWhere) {
                if((list($sKey, $mValue) = explode('-', $sWhere, 2))) {
                    $sKey = addslashes($sKey);
                    $aWhere[] = sprintf('`%s` = %s', $sKey, prepareInput($sKey, $mValue));
                }
            }
            if(count($aWhere) > 0) {
                return $_oResponse->write(json(get($_aArg['sTable'], implode(' AND ', $aWhere))));
            }
        }
    }
    return $_oResponse->withStatus(405)->write('Method not allowed for current user.');
});

/**
 * Retrieve all instances of any table. That means god mode (or admin mode), but without archives.
 */
$oApp->get('/{sTable}/all', function($_oRequest, Psr\Http\Message\ResponseInterface $_oResponse, array $_aArg) {
    if(login($_oRequest) && $bAdmin === TRUE) {
        return $_oResponse->write(json(get($_aArg['sTable'], NULL, FALSE, TRUE)));
    }
    return $_oResponse->withStatus(405)->write('Method not allowed for current user.');
});

/**
 * Retrieve all instances of any table. That means god mode (or admin mode), but without archives.
 */
$oApp->get('/{sTable}/all/archive', function($_oRequest, Psr\Http\Message\ResponseInterface $_oResponse, array $_aArg) {
    if(login($_oRequest) && $bAdmin === TRUE) {
        if(in_array('bArchive', getColumnNames($_aArg['sTable']))) {
            return $_oResponse->write(json(get($_aArg['sTable'], 'bArchive', TRUE, TRUE)));
        } else {
            $_oResponse->withStatus(404)->write('This collection does not have an archive.');
        }
    }
    return $_oResponse->withStatus(405)->write('Method not allowed for current user.');
});

/**
 * Retrieve all archived (and only those) instances of any table.
 */
$oApp->get('/{sTable}/archive', function($_oRequest, Psr\Http\Message\ResponseInterface $_oResponse, array $_aArg) {
    if(login($_oRequest)) {
        if(in_array('bArchive', getColumnNames($_aArg['sTable']))) {
            return $_oResponse->write(json(get($_aArg['sTable'], 'bArchive', TRUE)));
        } else {
            $_oResponse->withStatus(404)->write('This collection does not have an archive.');
        }
    }
    return $_oResponse->withStatus(405)->write('Method not allowed for current user.');
});






/**
 * Send an anonymous and un-protocolled email to the specified webmaster's address. Necessary parameters:
 * * from (needs to be valid email address or recipient following RFC 2822)
 * * subject (following RFC 2047)
 * * body
 */
$oApp->post('/contact', function($_oRequest, Psr\Http\Message\ResponseInterface $_oResponse, array $_aArg) {
	$aData = $_oRequest->getParsedBody();
	$sFrom = isset($aData['from']) ? trim($aData['from']) : '';
	$sSubject = isset($aData['subject']) ? trim($aData['subject']) : '';
	$sMail = isset($aData['body']) ? wordwrap(trim($aData['body']), 70) : '';
	if($sFrom != '' && $sSubject != '' && $sMail != '') {
		$sHeader = implode(chr(10), [
			'From: '.$sFrom,
			'Reply-To: '.$sFrom,
			'Sender: '.MAIL_SENDER_NAME.' <'.MAIL_SENDER_ADDRESS.'>',
			'Return-Path: '.MAIL_SENDER_NAME.' <'.MAIL_SENDER_ADDRESS.'>',
			'X-Mailer: PHP/'.phpversion(),
			'MIME-Version: 1.0',
			'Content-type: text/plain; charset=utf-8',
			'Content-Transfer-Encoding: 7bit'
		]);
		if(@mail(MAIL_WEBMASTER_ADDRESS, '=?UTF-8?B?'.base64_encode($sSubject).'?=', $sMail, $sHeader) === TRUE) {
			return $_oResponse->withStatus(200)->write(json([ [ 'bMail' => TRUE ] ]));
		} else {
			return $_oResponse->withStatus(500)->write('Email could not be sent.');
		}
	} else {
		return $_oResponse->withStatus(400)->write('Required information is missing (sender, subject, or email body).');
	}
});


/**
 * Send an email. Necessary parameters:
 * * to (needs to be a string indicating the table and id of the recipient; e.g. user:21 or student:42)
 * * subject (following RFC 2047)
 * * body
 */
$oApp->post('/email', function($_oRequest, Psr\Http\Message\ResponseInterface $_oResponse, array $_aArg) {
    if(login($_oRequest)) {
        $aData = $_oRequest->getParsedBody();
        global $nUseId;
        list($sRecipientTable, $sRecipientId) = explode(':', trim($aData['to']), 2);
        $aRecipient = [];
        $sRecipientTable = strtolower(trim($sRecipientTable));
        switch($sRecipientTable) {
            case 'user':
                $aRecipient = get('user', intval($sRecipientId), FALSE, TRUE)[0];
                break;
            case 'student':
                $aRecipient = get('student', intval($sRecipientId))[0];
                break;
        }
        $aUser = get('user')[0];
        if(isset($aRecipient['sMail']) && isset($aUser['sMail'])) {
            $aSet = [
                'nUseId' => $nUseId,
                'dCreate' => time(),
                'nRecipientUseId' => $sRecipientTable == 'user' ? $aRecipient['nUseId'] : NULL,
                'nRecipientStuId' => $sRecipientTable == 'student' ? $aRecipient['nStuId'] : NULL,
                'sRecipient' => $aRecipient['sName'].' <'.$aRecipient['sMail'].'>',
                'sSubject' => trim($aData['subject']),
                'sMail' => wordwrap(trim($aData['body']), 70),
                'sHeader' => implode(chr(10), [
                    'From: '.$aUser['sName'].' <'.$aUser['sMail'].'>',
                    'Reply-To: '.$aUser['sName'].' <'.$aUser['sMail'].'>',
                    'Sender: '.MAIL_SENDER_NAME.' <'.MAIL_SENDER_ADDRESS.'>',
                    'Return-Path: '.MAIL_SENDER_NAME.' <'.MAIL_SENDER_ADDRESS.'>',
                    'X-Mailer: PHP/'.phpversion(),
                    'MIME-Version: 1.0',
                    'Content-type: text/plain; charset=utf-8',
                    'Content-Transfer-Encoding: 7bit',
                ])
            ];
            if($aSet['sRecipient'] != '' && $aSet['sSubject'] != '' && $aSet['sMail'] != '') {
                if(@mail($aSet['sRecipient'], '=?UTF-8?B?'.base64_encode($aSet['sSubject']).'?=', $aSet['sMail'], $aSet['sHeader']) === TRUE) {
                    $aSet = strenghenPrivacy('email', $aSet);
                    foreach($aSet as $sKey => $mValue) {
                        $aSet[$sKey] = prepareInput($sKey, $mValue);
                    }
                    $sSql = sprintf('INSERT INTO `email` (%s) VALUES(%s)', implode(', ', array_keys($aSet)), implode(', ', array_values($aSet)));
                    if(($oResult = query($sSql))) {
                        global $oDb;
                        return $_oResponse->write(json(get('email', $oDb->insert_id)));
                    } else {
                        return $_oResponse->withStatus(500)->write('Database error on insert.');
                    }
                } else {
                    return $_oResponse->withStatus(500)->write('Email could not be sent.');
                }
            } else {
                return $_oResponse->withStatus(400)->write('Required information is missing (recipient, subject, or email body).');
            }
        } else {
            return $_oResponse->withStatus(400)->write('Necessary recipient information cannot be found.');
        }
    }
    return $_oResponse->withStatus(405)->write('Method not allowed for current user.');
});


/**
 * Add a new user.
 */
$oApp->post('/user', function($_oRequest, Psr\Http\Message\ResponseInterface $_oResponse, array $_aArg) {
    if(login($_oRequest)) {
        global $oDb, $bAdmin, $nUseId;
        $aInsert = $_oRequest->getParsedBody();
        if($bAdmin === TRUE && isset($aInsert['sUser'])) {
            $sSql = sprintf('INSERT INTO `user` (dCreate, sUser) VALUES(%s, %s)', prepareInput('dCreate', time()), prepareInput('sUser', $aInsert['sUser']));
            if(($oResult = query($sSql))) {
                $aEntry = get('user', $oDb->insert_id, FALSE, TRUE)[0];
                $sNewPassword = '';
                while(strlen($sNewPassword) < 10) {
                    $nRandom = rand(33, 122);
                    if(!in_array($nRandom, [ 44, 91, 92, 93, 94, 96 ])) {
                        $sNewPassword .= chr($nRandom);
                    }
                }
                $aSet = [];
                $aUpdate = strenghenPrivacy('user', array_merge($aInsert, [ 'nUseId' => $aEntry['nUseId'], 'sPassword' => md5($sNewPassword) ]));
                foreach($aUpdate as $sUpdateKey => $mValue) {
                    if((array_key_exists($sUpdateKey, $aEntry) || $sUpdateKey == 'sPassword') && 
                       !in_array($sUpdateKey, [ 'nUseId', 'dCreate', 'dUpdate', 'bArchive' ])) {

                        $aSet[] = sprintf('`%s` = %s', $sUpdateKey, prepareInput($sUpdateKey, $mValue));
                    }
                }
                if(query(sprintf('UPDATE `user` SET %s WHERE `nUseId` = %u LIMIT 1', implode(', ', $aSet), $aEntry['nUseId']))) {
                    $aUser = get('user')[0];
                    $aEntry = get('user', intval($aEntry['nUseId']), FALSE, TRUE)[0];
                    $aSet = [
                        'nUseId' => $nUseId,
                        'dCreate' => time(),
                        'nRecipientUseId' => $aEntry['nUseId'],
                        'nRecipientStuId' => NULL,
                        'sRecipient' => $aEntry['sName'].' <'.$aEntry['sMail'].'>',
                        'sSubject' => i18n('mail.new.subject', $aEntry['eLanguage'], $aEntry['eDialect']),
                        'sMail' => wordwrap(sprintf(i18n('mail.new.body', $aEntry['eLanguage'], $aEntry['eDialect']), $aEntry['sName'] == '' ? $aEntry['sUser'] : $aEntry['sName'], $aEntry['sName'], $aEntry['sUser'], $sNewPassword), 70),
                        'sHeader' => implode(chr(10), [
                            'From: '.$aUser['sName'].' <'.$aUser['sMail'].'>',
                            'Reply-To: '.$aUser['sName'].' <'.$aUser['sMail'].'>',
                            'Sender: '.MAIL_SENDER_NAME.' <'.MAIL_SENDER_ADDRESS.'>',
                            'Return-Path: '.MAIL_SENDER_NAME.' <'.MAIL_SENDER_ADDRESS.'>',
                            'X-Mailer: PHP/'.phpversion(),
                            'MIME-Version: 1.0',
                            'Content-type: text/plain; charset=utf-8',
                            'Content-Transfer-Encoding: 7bit',
                        ])
                    ];
                    if(@mail($aSet['sRecipient'], '=?UTF-8?B?'.base64_encode($aSet['sSubject']).'?=', $aSet['sMail'], $aSet['sHeader']) === TRUE) {
                        $aSet['sMail'] = str_replace($sNewPassword, str_repeat('*', strlen($sNewPassword)), $aSet['sMail']);
                        $aSet = strenghenPrivacy('email', $aSet);
                        foreach($aSet as $sKey => $mValue) {
                            $aSet[$sKey] = prepareInput($sKey, $mValue);
                        }
                        $sSql = sprintf('INSERT INTO `email` (%s) VALUES(%s)', implode(', ', array_keys($aSet)), implode(', ', array_values($aSet)));
                        if(($oResult = query($sSql))) {
                            return $_oResponse->write(json([ $aEntry ]));
                        } else {
                            return $_oResponse->withStatus(500)->write('Database error on email-sending insert.');
                        }
                    } else {
                        return $_oResponse->withStatus(500)->write('Email could not be sent.');
                    }
                } else {
                    return $_oResponse->withStatus(500)->write('Database error on user-information update.');
                }
            } else {
                return $_oResponse->withStatus(500)->write('Database error on insert.');
            }
        }
    }
    return $_oResponse->withStatus(405)->write('Method not allowed for current user.');
});


/**
 * Add a new entry to a table.
 */
$oApp->post('/{sTable}', function($_oRequest, Psr\Http\Message\ResponseInterface $_oResponse, array $_aArg) {
    if(login($_oRequest)) {
        global $nUseId;
        $sTable = addslashes(trim($_aArg['sTable']));
        $sPrimary = extractPrimaryKey($sTable);
        $aInsert = strenghenPrivacy($sTable, in_array('nUseId', getColumnNames($sTable)) ? 
                                    array_merge($_oRequest->getParsedBody(), [ 'nUseId' => $nUseId ]) :
                                    $_oRequest->getParsedBody());
        $aColumn = getColumnNames($sTable);
        $aSet = [ 'dCreate' => time() ];
        foreach($aInsert as $sInsertKey => $mValue) {
            if(in_array($sInsertKey, getColumnNames($sTable)) &&
               !in_array($sInsertKey, [ $sPrimary, 'dCreate', 'dUpdate', 'bArchive', 'nUseId', 'bAdmin' ])) {
                
                $aSet[$sInsertKey] = prepareInput($sInsertKey, $mValue);
            }
        }
        if(in_array('nUseId', getColumnNames($sTable))) {
            $aSet['nUseId'] = $nUseId;
        }
        $sSql = sprintf('INSERT INTO `%s` (%s) VALUES(%s)', $sTable, implode(', ', array_keys($aSet)), implode(', ', array_values($aSet)));
        if(($oResult = query($sSql))) {
            global $oDb;
            return $_oResponse->write(json(get($sTable, $oDb->insert_id)));
        } else {
            return $_oResponse->withStatus(500)->write('Database error on insert.');
        }
    }
    return $_oResponse->withStatus(405)->write('Method not allowed for current user.');
});







/**
 * Set a new password.
 */
$oApp->put('/password', function($_oRequest, Psr\Http\Message\ResponseInterface $_oResponse, array $_aArg) {
    if(login($_oRequest)) {
        $aUpdate = $_oRequest->getParsedBody();
        global $nUseId, $bAdmin;
        if(isset($aUpdate['sPassword'])) {
            $aSet = [ 'dUpdate = '.time(), sprintf('`sPassword` = %s', prepareInput('sPassword', $aUpdate['sPassword'])) ];
            query(sprintf('UPDATE `user` SET %s WHERE `nUseId` = %u LIMIT 1', implode(', ', $aSet), $nUseId));
            return $_oResponse->write(json(get('user')));
        } elseif(isset($aUpdate['nUseId'])) {
            $nUseIdToSet = intval($aUpdate['nUseId']);
            if($nUseIdToSet > 0 && $bAdmin) {
                $sNewPassword = '';
                while(strlen($sNewPassword) < 10) {
                    $nRandom = rand(33, 122);
                    if(!in_array($nRandom, [ 44, 91, 92, 93, 94, 96 ])) {
                        $sNewPassword .= chr($nRandom);
                    }
                }
                $aSet = [ 'dUpdate = '.time(), sprintf('`sPassword` = %s', prepareInput('sPassword', md5($sNewPassword))) ];
                if(query(sprintf('UPDATE `user` SET %s WHERE `nUseId` = %u LIMIT 1', implode(', ', $aSet), $nUseIdToSet))) {
                    $aUser = get('user')[0];
                    $aRecipient = get('user', $nUseIdToSet, FALSE, $bAdmin)[0];
                    $aSet = [
                        'nUseId' => $nUseId,
                        'dCreate' => time(),
                        'nRecipientUseId' => $nUseIdToSet,
                        'nRecipientStuId' => NULL,
                        'sRecipient' => $aRecipient['sName'].' <'.$aRecipient['sMail'].'>',
                        'sSubject' => i18n('mail.pw.subject', $aRecipient['eLanguage'], $aRecipient['eDialect']),
                        'sMail' => wordwrap(sprintf(i18n('mail.pw.body', $aRecipient['eLanguage'], $aRecipient['eDialect']), $aRecipient['sName'] == '' ? $aRecipient['sUser'] : $aRecipient['sName'], $sNewPassword), 70),
                        'sHeader' => implode(chr(10), [
                            'From: '.$aUser['sName'].' <'.$aUser['sMail'].'>',
                            'Reply-To: '.$aUser['sName'].' <'.$aUser['sMail'].'>',
                            'Sender: '.MAIL_SENDER_NAME.' <'.MAIL_SENDER_ADDRESS.'>',
                            'Return-Path: '.MAIL_SENDER_NAME.' <'.MAIL_SENDER_ADDRESS.'>',
                            'X-Mailer: PHP/'.phpversion(),
                            'MIME-Version: 1.0',
                            'Content-type: text/plain; charset=utf-8',
                            'Content-Transfer-Encoding: 7bit',
                        ])
                    ];
                    if(@mail($aSet['sRecipient'], '=?UTF-8?B?'.base64_encode($aSet['sSubject']).'?=', $aSet['sMail'], $aSet['sHeader']) === TRUE) {
                        $aSet['sMail'] = str_replace($sNewPassword, str_repeat('*', strlen($sNewPassword)), $aSet['sMail']);
                        $aSet = strenghenPrivacy('email', $aSet);
                        foreach($aSet as $sKey => $mValue) {
                            $aSet[$sKey] = prepareInput($sKey, $mValue);
                        }
                        $sSql = sprintf('INSERT INTO `email` (%s) VALUES(%s)', implode(', ', array_keys($aSet)), implode(', ', array_values($aSet)));
                        if(($oResult = query($sSql))) {
                            global $oDb;
                            return $_oResponse->write(json(get('email', $oDb->insert_id)));
                        } else {
                            return $_oResponse->withStatus(500)->write('Database error on email-sending insert.');
                        }
                    } else {
                        return $_oResponse->withStatus(500)->write('Email could not be sent.');
                    }
                } else {
                    return $_oResponse->withStatus(500)->write('Database error on password update.');
                }
            }
        }
    }
    return $_oResponse->withStatus(405)->write('Method not allowed for current user.');
});

/**
 * Update an entry within a table.
 */
$oApp->put('/{sTable}/{nUid}', function($_oRequest, Psr\Http\Message\ResponseInterface $_oResponse, array $_aArg) {
    if(login($_oRequest)) {
        global $bAdmin;
        $sTable = addslashes(trim($_aArg['sTable']));
        $sPrimary = extractPrimaryKey($sTable);
        $nPrimary = intval($_aArg['nUid']);
        $aEntry = get($sTable, $nPrimary, FALSE, $sTable == 'user' ? $bAdmin : FALSE);
        if(count($aEntry) == 1) {
            $aEntry = $aEntry[0];
            $aUpdate = $_oRequest->getParsedBody();
            //add nUseId from database entry in order to enable encryption
            if(!isset($aUpdate['nUseId']) && isset($aEntry['nUseId'])) {
                $aUpdate['nUseId'] = $aEntry['nUseId'];
            }
            $aUpdate = strenghenPrivacy($sTable, $aUpdate);
            $aSet = [ 'dUpdate = '.time() ];
            foreach($aUpdate as $sUpdateKey => $mValue) {
                if(array_key_exists($sUpdateKey, $aEntry) && 
                   !in_array($sUpdateKey, [ $sPrimary, 'dCreate', 'dUpdate', 'bArchive', 'nUseId', 'bAdmin' ])) {
                    
                    $aSet[] = sprintf('`%s` = %s', $sUpdateKey, prepareInput($sUpdateKey, $mValue));
                }
            }
            query(sprintf('UPDATE `%s` SET %s WHERE `%s` = %u LIMIT 1', $sTable, implode(', ', $aSet), $sPrimary, $nPrimary));
            return $_oResponse->write(json(get($sTable, $nPrimary, FALSE, $sTable == 'user' ? $bAdmin : FALSE)));
        } else {
            return $_oResponse->withStatus(405)->write('Invalid ID.');
        }
    }
    return $_oResponse->withStatus(405)->write('Method not allowed for current user.');
});







/**
 * Archive an entry from a table.
 */
$oApp->delete('/{sTable}/{nUid}', function($_oRequest, Psr\Http\Message\ResponseInterface $_oResponse, array $_aArg) {
    if(login($_oRequest)) {
        $sTable = addslashes(trim($_aArg['sTable']));
        $sPrimary = extractPrimaryKey($sTable);
        $nPrimary = intval($_aArg['nUid']);
        if($nPrimary > 0) {
            global $bAdmin;
            query(sprintf('UPDATE `%s` SET `bArchive` = 1, `dUpdate` = %d WHERE `%s` = %u LIMIT 1', $sTable, time(), $sPrimary, $nPrimary));
            return $_oResponse->write(json(get($sTable, $nPrimary, TRUE, $sTable == 'user' ? $bAdmin : FALSE)));
        } else {
            return $_oResponse->withStatus(405)->write('Invalid ID.');
        }
    }
    return $_oResponse->withStatus(405)->write('Method not allowed for current user.');
});

$oApp->run();









/**
 * Get single or multiple entries from table.
 * Depending on table, checks for current user to be the owner.
 * Foreign keys get resolved and, if one of the foreign keys does not match current user to be the owner, are accounted on.
 * 
 * @param string  $_sTable                     table name (e.g., course)
 * @param mixed   [$_mWhere                    = NULL]  if set, only table entries where (if int) primary key // (else) this where statement matches are returned
 * @param boolean [$_bIncludeArchived          = FALSE] if TRUE, all entries (incl. archived ones) are returned
 * @param boolean [$_bAdminMode          = FALSE] if TRUE and current user is admin, nUseId is not checked
 * @return array   array with entries full of associative array (if primary is given, still an array with only one row/entry is returned)
 */
function get($_sTable, $_mWhere = NULL, $_bIncludeArchived = FALSE, $_bAdminMode = FALSE) {
    $_sTable = addslashes(trim($_sTable));
    $aWhere = [];
    if(is_int($_mWhere)) {
        $aWhere[] = sprintf('`%s` = %u', extractPrimaryKey($_sTable), $_mWhere);
    } elseif($_mWhere !== NULL) {
        $aWhere[] = '`'.$_sTable.'`.'.trim((string)$_mWhere);
    }
    if(in_array('nUseId', getColumnNames($_sTable))) {
        global $nUseId, $bAdmin;
        if(!$_bAdminMode || !$bAdmin) {
            $aWhere[] = sprintf('`%s` = %d', 'nUseId', $nUseId);
        }
    }
    if(!$_bIncludeArchived && in_array('bArchive', getColumnNames($_sTable))) {
        $aWhere[] = 'NOT bArchive';
    }
    $aTableForeign = resolveForeignKeyDependencies($_sTable, $_bIncludeArchived, $_bAdminMode);
    for($i = 0; $i < count($aTableForeign); $i++) {
        if($aTableForeign[$i]['sWhere'] != '') {
            $aWhere[] = $aTableForeign[$i]['sWhere'];
        }
    }
    $sSql = sprintf('SELECT * FROM `%s` %s %s', $_sTable, count($aWhere) > 0 ? 'WHERE' : '', implode(' AND ', $aWhere));
    if(($oResult = query($sSql))) {
        if($oResult->num_rows > 0) {
            $aReturn = [];
            while(($aRow = $oResult->fetch_assoc())) {
                $aRow = weakenPrivacy($_sTable, $aRow);
                $mRow = resolveForeignKeys($_sTable, $aRow);
                if($mRow !== FALSE) {
                    $aReturn[] = resolveChildren($_sTable, $mRow);
                }
            }
            return $aReturn;
        }
    }
    return [];
}



/**
 * Takes care of advanced privacy settings:
 * * encrypt/decrypt student information (name, nr, mail, note)
 * * encrypt/decrypt user information (name, mail)
 * 
 * @param  string $_sTable original table of the current entry
 * @param  array  $_aRow   data row (associative array)
 * @param  boolean $_bInvertPrivacy  if set to true, decryption is used; encryption otherwise
 * @return array  same as $_aRow, but incl. encrypted/decrypted information
 */
function strenghenPrivacy($_sTable, $_aRow, $_bInvertPrivacy = FALSE) {
	//if(in_array($_sTable, [ 'student', 'user' ]) && isset($_aRow['nUseId'])) {
	if(isset($_aRow['nUseId'])) {
		$oCrypt = new \phpseclib\Crypt\AES;
		$oCrypt->setKey(md5(AES_SALT.$_aRow['nUseId']));
		//foreach([ 'sName', 'sNr', 'sMail', 'sNote' ] as $sColumn) {
        foreach($_aRow as $sColumn => $mValue) {
			//if(isset($_aRow[$sColumn]) && $_aRow[$sColumn] != '') {
            if($sColumn{0} == 's' && $mValue != '' && !in_array($sColumn, [ 'sUser', 'sPassword' ])) {
				$_aRow[$sColumn] = $_bInvertPrivacy ? $oCrypt->decrypt(base64_decode($mValue)) : base64_encode($oCrypt->encrypt($mValue));
				if($_aRow[$sColumn] === FALSE) {
					$_aRow[$sColumn] = '';
				}
			}
		}
	}
	return $_aRow;
}

/**
 * Handles outgoing data in terms of privacy (i.e., prepares them to be visible to the user):
 * * decrypt student information (name, nr, mail, note)
 * * hide/unset passwords
 * 
 * @param  string $_sTable original table of the current entry
 * @param  array  $_aRow   data row (associative array)
 * @return array  same as $_aRow, but containing decrypted (clear-text) information ready-to-be-shown
 */
function weakenPrivacy($_sTable, $_aRow) {
	unset($_aRow['sPassword']);
	return strenghenPrivacy($_sTable, $_aRow, TRUE);
}


/**
 * Returns configuration array for a given row in order to identify child entries (through reverse foreign keys).
 * resolveForeignKeyDependencies(...) has to be called prior to this function.
 * 
 * @param  string $_sTable original table of the current entry
 * @param  array  $_aRow   single data row (as given from get(...))
 * @return array  same as $_aRow, but incl. a `children` key with row array incl. dependencides [sTable, sColumn]
 */
function resolveChildren($_sTable, $_aRow) {
    global $aCacheChildren;
    if(isset($aCacheChildren[$_sTable])) {
        return array_merge($_aRow, [ 'children' => $aCacheChildren[$_sTable] ]);
    }
    return array_merge($_aRow, [ 'children' => [] ]);
}


/**
 * Runs through all values in one row and resolves foreign keys into foreign-table configuration entries.
 * 
 * @param  string $_sTable original table of the current entry
 * @param  array  $_aRow   single data row (as given from get(...))
 * @return array  same as $_aRow, but incl. a `foreign` key with row array on each foreign column key
 */
function resolveForeignKeys($_sTable, $_aRow) {
    global $aCacheForeignKey;
    $aRow = [ 'foreign' => [] ];
    foreach($_aRow as $sColumn => $mValue) {
        $aRow[$sColumn] = $mValue;
        if(isset($aCacheForeignKey[$_sTable][$sColumn])) {
            $aRow['foreign'][$sColumn] = $aCacheForeignKey[$_sTable][$sColumn]['sTable'];
        }
    }
    return $aRow;
}

/**
 * For a given table, create a WHERE statement which checks for corresponding entries which are not archived and belong to the current user.
 * As an example, for the stu2rat table, this adds the statement that the corresponding student is not deleted and belongs to the current user.
 * 
 * @param  string $_sTable table for which the statement should be created
 * @param  boolean $_bIncludeArchived if set to TRUE, bArchive is not checked
 * @param  boolean $_bAdminMode if set to TRUE and current user is admin, nUseId is not checked
 * @return string WHERE statement without prefixing WHERE or AND
 */
function resolveForeignKeyDependencies($_sTable, $_bIncludeArchived = FALSE, $_bAdminMode = FALSE) {
    global $aCacheForeignKey, $aCacheChildren;
    if(!isset($aCacheForeignKey[$_sTable]) || !isset($aCacheChildren[$_sTable])) {
        $aCacheForeignKey[$_sTable] = [];
        $aCacheChildren[$_sTable] = [];
        $sSql = sprintf('SELECT `TABLE_NAME` AS sOwnTable, `COLUMN_NAME` AS sOwnColumn, 
                                `REFERENCED_TABLE_NAME` AS sForeignTable, `REFERENCED_COLUMN_NAME` AS sForeignColumn
                         FROM `INFORMATION_SCHEMA`.`KEY_COLUMN_USAGE`
                         WHERE `REFERENCED_TABLE_NAME` IS NOT NULL AND (`TABLE_NAME` = \'%s\' OR `REFERENCED_TABLE_NAME` = \'%s\')', 
                        $_sTable, $_sTable);
        if(($oResult = query($sSql))) {
            while(($aForeignStructure = $oResult->fetch_assoc())) {
                if($aForeignStructure['sForeignTable'] == $_sTable) {
                    //children
                    $aCacheChildren[$_sTable][] = [
                        'sTable' => $aForeignStructure['sOwnTable'],
                        'sColumn' => $aForeignStructure['sOwnColumn']
                    ];
                } else {
                    //foreign
                    $aWhere = [];
                    if(!$_bIncludeArchived && in_array('bArchive', getColumnNames($aForeignStructure['sForeignTable']))) {
                        $aWhere[] = 'NOT bArchive';
                    }
                    if(in_array('nUseId', getColumnNames($aForeignStructure['sForeignTable']))) {
                        global $nUseId, $bAdmin;
                        if(!$_bAdminMode || !$bAdmin) {
                            $aWhere[] = sprintf('`%s` = %d', 'nUseId', $nUseId);
                        }
                    }
                    $sWhereForeignForeign = resolveForeignKeyDependencies($aForeignStructure['sForeignTable'], $_bIncludeArchived, $_bAdminMode);
                    if($sWhereForeignForeign != '') {
                        $aWhere[] = $sWhereForeignForeign;
                    }
                    $aCacheForeignKey[$_sTable][$aForeignStructure['sOwnColumn']] = [
                        'sTable' => $aForeignStructure['sForeignTable'],
                        'sWhere' => count($aWhere) == 0 ? '' :
                            sprintf('`%s` IN (SELECT `%s` FROM %s WHERE %s)', 
                                    $aForeignStructure['sOwnColumn'], 
                                    $aForeignStructure['sForeignColumn'], 
                                    $aForeignStructure['sForeignTable'], 
                                    implode(' AND ', $aWhere)
                                   )
                    ];
                }
            }
        }
    }
    return $aCacheForeignKey[$_sTable];
}



/**
 * Return all available column names for one table.
 * 
 * @param  string $_sTable table name
 * @return array  column names as written inside the database
 */
function getColumnNames($_sTable) {
    global $aCacheColumn;
    if(!isset($aCacheColumn[$_sTable])) {
        $aCacheColumn[$_sTable] = [];
        $sSql = sprintf('SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA` = \'%s\' AND `TABLE_NAME` = \'%s\'', 
                        DB_NAME, $_sTable);
        if(($oResult = query($sSql))) {
            if($oResult->num_rows > 0) {
                while(($aRow = $oResult->fetch_assoc())) {
                    $aCacheColumn[$_sTable][] = $aRow['COLUMN_NAME'];
                }
            }
        }
    }
    return $aCacheColumn[$_sTable];
}






/**
 * Execute an SQL statement. If no connection has been initiated before, initiate it first.
 * 
 * @param  string $_sSql statement to be executed
 * @return mixed  depends on statement, see http://php.net/manual/en/mysqli.query.php
 */
function query($_sSql) {
    global $oDb;
    if($oDb === NULL) {
        $oDb = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
        if(!$oDb->connect_error) {
            query('SET NAMES utf8;');
        }
    }
    return $oDb->query($_sSql);
}

/**
 * Prepare a single column to be inserted into the database.
 * 
 * @param  string $_sColumn column name
 * @param  mixed  $_mValue  value
 * @return string prepared value (incl. quotes if necessary)
 */
function prepareInput($_sColumn, $_mValue) {
    if($_mValue === NULL) {
        return 'NULL';
    }
    switch($_sColumn{0}) {
        case 'n':
            return sprintf('%d', intval($_mValue));
        case 'f':
            return sprintf('%.2f', floatval($_mValue));
        case 'b':
            return sprintf('%u', intval($_mValue) == TRUE);
        case 's':
        default:
            return sprintf('\'%s\'', addslashes($_mValue));
    }
}

/**
 * Based on an incoming request object, check if call is a valid (i.e., allowed/authorized) call.
 * Therefore, the request needs to provide a X-Grader-Authorization header.
 * This header follows digest access authentication principles.
 * - Authentication scheme: GraderDigest
 * - Parameter "user": username
 * - Parameter "nonce": random string
 * - Parameter "method": one of HMAC hashing algorithms, such as SHA1, MD5, etc.
 * - Parameter "signature": hash (/w given method, key = md5'd user password) of (in that respective order) url, user, nonce, request body
 * Example: GraderDigest user="mario",nonce="QZ28NP04XS4P7VXE",method="SHA1",signature="ebfdcac2aa5dea36755fb3843cc740bb1e8a5989"
 * 
 * @param  Psr\Http\Message\ServerRequestInterface $_oRequest request object as retrieved from Slim
 * @return boolean                                 TRUE if valid/allowed/authorized
 */
function login(Psr\Http\Message\ServerRequestInterface $_oRequest) {
    if($_oRequest->hasHeader('X-Grader-Authorization')) {
        $sAuth = $_oRequest->getHeaderLine('X-Grader-Authorization');
        if(strpos($sAuth, 'GraderDigest') === 0) {
            $aHash = [ 'url' => (string)$_oRequest->getUri(), 'user' => '', 'nonce' => '', 'body' => (string)$_oRequest->getBody() ];
            $sSignature = $sMethod = '';
            $aParam = explode(',', substr($sAuth, 13));
            foreach($aParam as $sParam) {
                $sParam = trim($sParam);
                list($sKey, $sValue) = explode('=', $sParam, 2);
                $sKey = strtolower(trim($sKey));
                $sValue = trim($sValue);
                if($sValue{0} == '"' && substr($sValue, -1) == '"') {
                    $sValue = substr($sValue, 1, strlen($sValue) - 2);
                }
                if($sKey == 'signature' && $sValue != '') {
                    $sSignature = $sValue;
                } elseif($sKey == 'method' && in_array(strtolower($sValue), hash_algos())) {
                    $sMethod = strtolower($sValue);
                } elseif(in_array($sKey, [ 'user', 'nonce' ])) {
                    $aHash[$sKey] = $sValue;
                }
            }
            if($sSignature != '' && $sMethod != '' && $aHash['user'] != '') {
                if(($oResult = query('SELECT nUseId, sPassword, bAdmin FROM `user` WHERE sUser = '.prepareInput('sUser', $aHash['user']).' AND NOT bArchive LIMIT 1'))) {
                    if($oResult->num_rows == 1) {
                        $aUser = $oResult->fetch_assoc();
                        if(hash_hmac($sMethod, implode('', $aHash), $aUser['sPassword']) === $sSignature) {
                            global $nUseId, $bAdmin;
                            $nUseId = $aUser['nUseId'];
                            if($aUser['bAdmin'] == 1) {
                                $bAdmin = TRUE;
                            }
                            return TRUE;
                        }
                    }
                }
            }
        }
    }
    return FALSE;
}

/**
 * Convert anything into or from JSON.
 * 
 * @param  mixed $_mInput could either be an array to be json'ified or a JSON string to be converted into an array.
 * @return mixed array or JSON string
 */
function json($_mInput) {
    if(is_array($_mInput)) {
        return json_encode($_mInput);
    } else {
        return json_decode($_mInput, TRUE);
    }
}

/**
 * Extract the name of the primary key column based on a given table name.
 * 
 * @param  string $_sTable table name to be used
 * @return string primary key name
 */
function extractPrimaryKey($_sTable) {
    $_sTable = trim($_sTable);
    if(strpos($_sTable, '2') === FALSE) {
        return 'n'.ucfirst(substr($_sTable, 0, 3)).'Id';
    } else {
        return 'n'.strtoupper($_sTable{0}).'2'.strtoupper($_sTable{4}).'Id';
    }
}

?>