<?php

require_once('../api/config.php');

/**
 * Dumps the database and compresses the dump.
 * Backups are organized in /year/month/yyyymmdd.sql.gz dir-file structures
 *
 * Process:
 * * find last backup
 * * check if it is at least BACKUP_DAYS days old (if so, a new backup should be made)
 * * backup (and put the file into the according folder)
 * * if first backup per month, push the file to another server (BACKUP_EXTERNAL_SERVER) as well
 * * clean up older backups if necessary
 * * send an email about the backup's status
 */

$dLastBackup = 0;
$dEarliestBackup = time();
$bMakeABackup = FALSE;
$bExternalBackup = FALSE;
$bExternalBackupSuccess = FALSE;
$bDeletedOldBackup = FALSE;
$nBackupsAvailable = 0;

//find last backup
foreach(new DirectoryIterator('./') as $oYear) {
	if(!$oYear->isDot() && $oYear->isDir()) {
		foreach(new DirectoryIterator('./'.$oYear->getFilename().'/') as $oMonth) {
			if(!$oMonth->isDot() && $oMonth->isDir()) {
				foreach(new DirectoryIterator('./'.$oYear->getFilename().'/'.$oMonth->getFilename().'/') as $oBackup) {
					if(!$oBackup->isDot() && $oBackup->isFile()) {
						if(substr($oBackup->getFilename(), 8) == '.sql.gz') {
							$dCurrentBackup = mktime(0, 0, 0, $oMonth->getFilename(), substr($oBackup->getFilename(), 6, 2), $oYear->getFilename());
							if($dCurrentBackup > 0) {
								$nBackupsAvailable++;
								if($dCurrentBackup > $dLastBackup) {
									$dLastBackup = $dCurrentBackup;
								}
								if($dCurrentBackup < $dEarliestBackup) {
									$dEarliestBackup = $dCurrentBackup;
								}
							}
						}
					}
				}
			}
		}
	}
}

//check if backup is necessary
if($dLastBackup < (time() - (BACKUP_DAYS*24*60*60))) {
	$bMakeABackup = TRUE;
	if(!is_dir(date('Y'))) {
		if(!mkdir(date('Y'))) {
			@mail(
				MAIL_WEBMASTER_ADDRESS,
				'=?UTF-8?B?'.base64_encode('Datenbank-Backup fehlgeschlagen').'?=',
				wordwrap(trim(
					'Hallo,'.chr(10).chr(10).
					'ich habe versucht, ein neues Backup der Datenbank zu ziehen, das hat aber nicht geklappt. '.
					'Grund dafür ist, dass der Jahresordner nicht erstellt werden konnte. '.
					'Das nächste Backup versuche ich dann, in '.BACKUP_DAYS.' Tagen zu ziehen.'.chr(10).chr(10).
					'Sorry,'.chr(10).
					'Stuperman'
				), 70),
				implode(chr(10), [
					'From: '.MAIL_SENDER_NAME.' <'.MAIL_SENDER_ADDRESS.'>',
					'X-Mailer: PHP/'.phpversion(),
					'MIME-Version: 1.0',
					'Content-type: text/plain; charset=utf-8',
					'Content-Transfer-Encoding: 7bit'
				])
			);
		}
	}
	if(!is_dir(date('Y/m'))) {
		$bExternalBackup = TRUE;
		if(!mkdir(date('Y/m'))) {
			@mail(
				MAIL_WEBMASTER_ADDRESS,
				'=?UTF-8?B?'.base64_encode('Datenbank-Backup fehlgeschlagen').'?=',
				wordwrap(trim(
					'Hallo,'.chr(10).chr(10).
					'beim Versuch, ein neues Backup der Datenbank zu ziehen, bin ich dieses Mal leider gescheitert. '.
					(BACKUP_EXTERNAL ? 'Das ist doppelt blöd, weil ich das Backup dieses Mal zusätzlich wieder auf einen externen Server speichern wollte. ' : '').
					'Den nächsten Anlaufe wage ich dann wieder in '.BACKUP_DAYS.' Tagen.'.chr(10).chr(10).
					'Tut leid,'.chr(10).
					'Stuperman'
				), 70),
				implode(chr(10), [
					'From: '.MAIL_SENDER_NAME.' <'.MAIL_SENDER_ADDRESS.'>',
					'X-Mailer: PHP/'.phpversion(),
					'MIME-Version: 1.0',
					'Content-type: text/plain; charset=utf-8',
					'Content-Transfer-Encoding: 7bit'
				])
			);
		}
	}
}

if($bMakeABackup) {
	//backup (and put the file into the according folder)
	$sBackupFile = date('Y/m/Ymd').'.sql.gz';
	exec('mysqldump --opt --user='.DB_USER.' --password='.DB_PASSWORD.' '.DB_NAME.' | gzip > '.$sBackupFile);
	$nBackupSize = filesize($sBackupFile);
	if($nBackupSize > 0) {
		$nBackupsAvailable++;
	}
	
	//push to external server if wanted
	if($bExternalBackup && BACKUP_EXTERNAL) {
		if(BACKUP_EXTERNAL_sFTP) {
			$oFtp = ssh2_connect(BACKUP_EXTERNAL_SERVER);
			if(ssh2_auth_password($oFtp, BACKUP_EXTERNAL_USER, BACKUP_EXTERNAL_PASSWORD)) {
				if($sFtp = ssh2_sftp($oFtp)) {
					$oStream = fopen('ssh2.sftp://'.$sFtp.date('Ymd').'-BackupStuperman.sql.gz', 'w');
					if(fwrite($oStream, file_get_contents($sBackupFile)) !== FALSE) {
						$bExternalBackupSuccess = TRUE;
					}
					fclose($oStream);
				}
			}
		} else {
			$oFtp = BACKUP_EXTERNAL_FTPexplicitSSL ? ftp_ssl_connect(BACKUP_EXTERNAL_SERVER) : ftp_connect(BACKUP_EXTERNAL_SERVER);
			if(ftp_login($oFtp, BACKUP_EXTERNAL_USER, BACKUP_EXTERNAL_PASSWORD)) {
				ftp_pasv($oFtp, BACKUP_EXTERNAL_PASSIVE);
				if(ftp_put($oFtp, date('Ymd').'-BackupStuperman.sql.gz', $sBackupFile, FTP_ASCII)) {
					$bExternalBackupSuccess = TRUE;
				}
				ftp_close($oFtp);
			}
		}
	}
	
	//clean up an old backup
	if(BACKUP_DELETE && $nBackupsAvailable > BACKUP_DELETE_KEEP && $dEarliestBackup != $dLastBackup && $dEarliestBackup != time()) {
		@unlink(date('Y/m/Ymd', $dEarliestBackup).'.sql.gz');
		$bDeletedOldBackup = TRUE;
		$nBackupsAvailable--;
	}

	//send an email about the file's status
	$i = 0;
	while($nBackupSize > 1024) {
		$i++;
		$nBackupSize /= 1024;
	}
	@mail(
		MAIL_WEBMASTER_ADDRESS,
		'=?UTF-8?B?'.base64_encode('Datenbank-Backup durchgeführt').'?=',
		wordwrap(trim(
			'Hallo,'.chr(10).chr(10).
			'ich habe ein neues Backup der Datenbank (Nur der Datenbank!) erstellt. Zumindest glaube ich das. Die komprimierte Datei liegt derzeit auf meinem Server unter '.chr(10).
			'> '.$sBackupFile.chr(10).
			'und "wiegt" rund '.str_replace('.', ',', round($nBackupSize, 1)).' '.([ 'Byte', 'KByte', 'MByte', 'GByte', 'TByte', 'PByte' ][$i]).'. '.
			'Ich habe das Backup '.($bExternalBackup && BACKUP_EXTERNAL ? 'zur Sicherheit mal wieder' : 'dieses Mal NICHT').' auf unsere externe Backup-Serverinstanz '.(BACKUP_EXTERNAL_SERVER == '' ? '' : sprintf('(%s)', BACKUP_EXTERNAL_SERVER)).' gespielt. '.
			($bExternalBackup && BACKUP_EXTERNAL ? 
				($bExternalBackupSuccess ? 'Das hat auch einwandfrei funktioniert. ' : 'Also, ich habe es versucht. Es hat nämlich nicht funktioniert. Insofern sind wir aktuell nicht externally save (Aaaaaaaaahhh!). ') :
				'').
			($bDeletedOldBackup ? ('Darüber hinaus habe ich ein altes Backup ('.date('Y/m/Ymd', $dEarliestBackup).'.sql.gz'.') gelöscht.') : '').
			'Es '.($nBackupsAvailable == 1 ? 'ist' : 'sind').' jetzt '.$nBackupsAvailable.' Backup(s) gespeichert. Ich versuche, einen Stand von '.BACKUP_DELETE_KEEP.' Sicherungen aufzubauen und zu halten. '.
			'Das nächste Backup erstelle ich dann in '.BACKUP_DAYS.' Tagen.'.chr(10).chr(10).
			'Bis dann,'.chr(10).
			'Stuperman'
		), 70),
		implode(chr(10), [
			'From: '.MAIL_SENDER_NAME.' <'.MAIL_SENDER_ADDRESS.'>',
			'X-Mailer: PHP/'.phpversion(),
			'MIME-Version: 1.0',
			'Content-type: text/plain; charset=utf-8',
			'Content-Transfer-Encoding: 7bit'
		])
	);
}

?>