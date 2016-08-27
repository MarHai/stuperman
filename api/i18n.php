<?php

require_once('./config.php');

function i18n($_sName, $_sLanguage = 'de_DE', $_sDialect = 'school') {
    $aText = [
        'de_DE' => [
            'school' => [
                'mail.pw.subject' => '['.MAIL_SENDER_NAME.'] Neues Passwort',
                'mail.pw.body' => 'Hallo %s,'.chr(10).chr(10).'ich habe Dir ein neues Passwort erstellt, mit dem Du Dich wieder unter '.BASE_URL.' einloggen kannst. Es lautet:'.chr(10).'  %s'.chr(10).chr(10).'Bitte achte beim Einloggen auf Groß- und Kleinschreibung. Du kannst das Passwort gleich nach dem Einloggen auch wieder ändern, indem Du auf das Personensymbol ganz rechts oben (neben dem Eingabefeld für die Suche) klickst.'.chr(10).chr(10).'Schöne Grüße, '.chr(10).'Dein '.MAIL_SENDER_NAME,
                
                'mail.new.subject' => '['.MAIL_SENDER_NAME.'] Neuer Benutzer',
                'mail.new.body' => 'Hallo %s,'.chr(10).chr(10).'ich freue mich, Dir mitteilen zu können, dass ich Dir künftig helfen werde. Kurzum: Ich habe Dir ein neues Benutzerkonto erstellt, mit dem Du Dich unter '.BASE_URL.' einloggen kannst. Deine Zugangsdaten sind ganz einfach:'.chr(10).'  Benutzername: %s'.chr(10).'  Passwort: %s'.chr(10).chr(10).'Bitte achte beim Einloggen auf Groß- und Kleinschreibung. Du kannst das Passwort gleich nach dem Einloggen auch ändern, indem Du auf das Personensymbol ganz rechts oben (neben dem Eingabefeld für die Suche) klickst.'.chr(10).chr(10).'Für den Anfang empfehle ich Dir, Dich einzuloggen und einfach ein wenig umzuschauen. Ein Klick auf das Fragezeichen, ebenfalls ganz rechts oben, führt zu einer Seite voller Anleitungungen, auf der ich Dir zahlreiche praktische Tipps gebe.'.chr(10).chr(10).'Viel Spaß beim Umschauen und auf gute Zusammenarbeit, '.chr(10).'Dein '.MAIL_SENDER_NAME
            ],
            'university' => [
            ]
        ]
    ];
    
    $sLanguageDefault = 'de_DE';
    $sDialectDefault = 'school';
    if(!isset($aText[$_sLanguage])) {
        $_sLanguage = $sLanguageDefault;
    }
    if(!isset($aText[$_sLanguage][$_sDialect])) {
        $_sDialect = $sDialectDefault;
    }
    
    if(isset($aText[$_sLanguage][$_sDialect][$_sName])) {
        return $aText[$_sLanguage][$_sDialect][$_sName];
    } elseif(isset($aText[$_sLanguage][$sDialectDefault][$_sName])) {
        return $aText[$_sLanguage][$sDialectDefault][$_sName];
    } else {
        return $aText[$sLanguageDefault][$sDialectDefault][$_sName];
    }
}

?>