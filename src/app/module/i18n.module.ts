export module i18n {
    let sLanguage = 'de_DE';
    let sDialect = 'school';
    let sLanguageDefault = 'de_DE';
    let sDialectDefault = 'school';
    /**
     * Language object with (1) language, (2) type, (3) name, (4) the objects itself containing
     * * s  the singular version
     * * p  the plural version
     * * n  a number indicating from when onwards (>=) to use the plural
     */
    let oI18n = {
        de_DE: {
            school: {
                de_DE: { s: 'Deutsch (Deutschland)' },
                school: { s: 'Schule' },
                university: { s: 'Universität/(Fach-)Hochschule' },
                
                student: { s: 'Schüler' },
                course: { s: 'Klasse', p: 'Klassen', n: 2 },
                catalogue: { s: 'Bewertungskatalog', p: 'Bewertungskataloge', n: 2 },
                criteria: { s: 'Einzelkriterium', p: 'Einzelkriterien', n: 2 },
                grade: { s: 'Einzelbewertung', p: 'Einzelbewertungen', n: 2 },
                rating: { s: 'Teilleistung', p: 'Teilleistungen', n: 2 },
                system: { s: 'Notensystem', p: 'Notensysteme', n: 2 },
                cat2cri: { s: '%s aus %s' },
                stu2cou: { s: '%s in %s' },
                email: { s: 'Nachricht', p: 'Nachrichten', n: 2 },
                user: { s: 'Benutzer', p: 'Benutzer', n: 2 },
                talk: { s: 'Unterhaltung', p: 'Unterhaltungen', n: 2 },
                stu2rat: { s: 'bewertete Teilleistung', p: 'bewertete Teilleistungen', n: 2 },
                
                sUser: { s: 'Benutzername', p: 'Benutzernamen', n: 2 },
                sName: { s: 'Name', p: 'Namen', n: 2 },
                sCategory: { s: 'Schuljahr', p: 'Schuljahre', n: 2 },
                sNote: { s: 'Bemerkung', p: 'Bemerkungen', n: 2 },
                fWeight: { s: 'Gewichtung', p: 'Gewichtungen', n: 2 },
                fGradeTotal: { s: 'Gesamtnote', p: 'Gesamtnoten', n: 2 },
                sGrade: { s: 'Bewertungsoption', p: 'Bewertungsoptionen', n: 2 },
                fGrade: { s: 'Note', p: 'Noten', n: 2 },
                bGradeManual: { s: 'Note manuell überschrieben', p: 'Noten manuell überschrieben', n: 2 },
                fPoints: { s: 'Punkt', p: 'Punkte', n: 2 },
                fPointsTotal: { s: 'Gesamtpunktzahl' },
                nWidth: { s: 'Breite' },
                nHeight: { s: 'Höhe' },
                nMin: { s: 'Minimum', p: 'Minima', n: 2 },
                nMax: { s: 'Maximum', p: 'Maxima', n: 2 },
                bOptional: { s: 'Optional' },
                nTry: { s: 'Versuch', p: 'Versuche', n: 2 },
                sNr: { s: 'Schülernummer', p: 'Schülernummern', n: 2 },
                sMail: { s: 'E-Mail-Adresse', p: 'E-Mail-Adressen', n: 2 },
                sPassword: { s: 'Passwort', p: 'Passwörter', n: 2 },
                sPasswordRepeat: { s: 'Passwort wiederholen', p: 'Passwörter wiederholen', n: 2 },
                sPasswordChange: { s: 'Passwort ändern', p: 'Passwörter ändern', n: 2 },
                bOfflineSync: { s: 'Offline-Synchronisierung', p: 'Offline-Synchronisierungen', n: 2 },
                sSubject: { s: 'Betreff' },
                sRecipient: { s: 'Empfänger', p: 'Empfänger', n: 2 },
                dCreate: { s: 'Zeitpunkt der Erstellung', p: 'Zeitpunkte der Erstellung', n: 2 },
                dUpdate: { s: 'Letzte Aktualisierung', p: 'Letzte Aktualisierungen', n: 2 },
                eLanguage: { s: 'Sprache', p: 'Sprachen', n: 2 },
                eDialect: { s: 'Dialektik' },
                sGroup: { s: 'Kategorie' },
                sGradeFail: { s: 'Nicht bestehende Bewertung' },
                sImage: { s: 'Bild', p: 'Bilder', n: 2 },
                
                offline: { s: 'Ich arbeite derzeit offline' },
                sync: { s: 'Ich synchronisiere gerade Deine Offline-Daten' },
                pointspectrum: { s: 'Punktespektrum' },
                obligatory: { s: 'zentrales Kriterium (Pflichteingabe)', p: 'zentrale Kriterien (Pflichteingaben)', n: 2 },
                optional: { s: 'freiwillige Angabe', p: 'freiwillige Angaben', n: 2 },
                inuse: { s: 'bereits eingesetzt' },
                notinuse: { s: 'noch nicht im Einsatz' },
                connection: { s: 'Verbindung', p: 'Verbindungen', n: 2 },
                wait: { s: 'Bitte warte kurz, ich kümmere mich gerade um alles ...' },
                done: { s: 'Alles klar, ich bin fertig.' },
                xdone: { s: '%d erledigt' },
                xopen: { s: '%d offen' },
                next: { s: 'Weiter' },
                back: { s: 'Zurück' },
                backto: { s: 'Zurück zu %.20s' },
                'true': { s: 'ja' },
                'false': { s: 'nein' },
                choose: { s: 'Wähle ...' },
                unpause: { s: 'Korrektur fortsetzen' },
                pause: { s: 'Pause' },
                gotit: { s: 'Verstanden' },
                add: { s: '%.30s hinzufügen' },
                addto: { s: '%.20s zu %.20s hinzufügen' },
                'remove': { s: 'entfernen' },
                'delete': { s: '%.30s löschen' },
                'delete.really': { s: 'Soll %s wirklich gelöscht werden?' },
                edit: { s: '%.30s bearbeiten' },
                'edit.really': { s: 'Wirklich abbrechen (dabei gehen diese Änderungen verloren)?' },
                'save': { s: 'Speichern' },
                'abort': { s: 'Abbrechen' },
                'status': { s: 'Status' },
                'overview': { s: 'Übersicht' },
                'time': { s: 'Zeit' },
                'login': { s: 'Anmelden' },
                'logout': { s: 'Abmelden' },
                'gradeavg': { s: 'Durchschnittsnote', p: 'Durchschnittsnoten', n: 2 },
                'gradepoints': { s: 'Durchschnittl. Punktezahl', p: 'Durchschnittl. Punktezahlen', n: 2 },
                'cntx': { s: 'Anzahl %s' },
                'reload': { s: 'neu laden' },
                'addnew': { s: 'neuer %s', p: 'neue %s', n: 2 },
                'addcopy': { s: 'erkannter %s', p: 'erkannte %s', n: 2 },
                'xdownload': { s: '%.30s herunterladen' },
                'sum': { s: 'Summe', p: 'Summen', n: 2 },
                'or': { s: '... oder ...' },
                'load': { s: 'Einen Moment Geduld bitte ...' },
                
                'addtry.students': { s: 'Für gewöhnlich wiederholen nicht alle Personen eine Teilleistung. Hier kannst Du deshalb die Wiederholer auswählen.' },
                'addtry.addall': { s: 'alle %s hinzufügen' },
                'addtry.addnotyetgraded': { s: 'nicht bewertete hinzufügen' },
                'addtry.addnegative': { s: 'negativ bewertete hinzufügen' },
                'addtry.removeall': { s: 'alle entfernen' },
                
                'imginstruction': { s: 'Lade hier ein passendes Bild hoch, ziehe ein passendes Bild hier rein oder füge es einfach mit <kbd><kbd>STRG</kbd> + <kbd>v</kbd></kbd> oder <kbd><kbd>&#8984;</kbd> + <kbd>v</kbd></kbd> ein.' },
                
                imprint: { s: 'Impressum' },
                imprintsecurity: { s: 'Datensicherheit' },
                imprintsecuritydesc: { s: 'Ich lege viel Wert auf Datensicherheit. Deshalb gibt es einige explizit verbaute Mechanismen, die Deine Zusammenarbeit mit mir sicherer machen sollen.\n\nDazu zählen:\n- SSL-Übertragung (https)\n- verschlüsseltes Authentifizierungsverfahren bei jeder Datenübertragung\n- Datenverschlüsselung auf unseren Servern\n- Server in Deutschland' },
                imprintcollection: { s: 'Gespeicherte Daten' },
                imprintcollectiondesc: { s: 'Abgesehen von den Informationen, die Du mir ohnehin anvertraust (Schüler, Noten, etc.) speichere ich noch einige weitere Informationen über Dich ab. Das sind nicht sonderlich viele, aber ich will hier ehrlich mit Dir sein. Quasi ohne Dein Wissen (bislang, denn jetzt weißt Du es ja) speichere ich:\n- Informationen zu deiner Nutzung (Uhrzeit, ob Du ein Notebook oder ein Smartphone verwendest, Spracheinstellungen, etc.), die ich mithilfe des Open-Source-Werkzeugs [Piwik](http://piwik.org/) sammle\n- **nichts** (Und damit meine ich: Nichts. Ich binde keine weiteren Seiten oder Werkzeuge ein, erfasse keine zusätzlichen Infos und erlaube auch keinen Drittanbietern Zugriff auf Deine Infos.)' },
                imprintmade: { s: 'Dank & Transparenz' },
                imprintmadedesc: { s: 'Es gibt noch ein paar Personen, die (indirekt) hier mitwirken. Das sind vor allen Dingen Entwickler auf der ganzen Welt, die zahlreiche Open-Source-Werkzeuge gebastelt haben (und nach wie vor daran basteln), die ich hier an der einen oder anderen Stelle nutze. Konkret gebührt also Dank den Damen und Herren hinter (in alphabetischer Reihenfolge) ...\n- angular\n- bootstrap\n- Chart.js\n- CryptoJS\n- Dragula\n- jQuery\n- Let\'s Encrypt\n- PapaParse\n- phpSecLib\n- Showdown\n- Slim' },
                imprintsrc: { s: 'Offenlegung' },
                imprintsrcdesc: { s: 'Noch mehr Transparenz gewünscht? Kein Problem. Den kompletten Quellcode von mir findest Du bei [GitHub](https://github.com/MarHai/stuperman). Man könnte mich hiermit also durchaus auch als Open-Source-Stuperman bezeichnen.\n\nÜbrigens bedeutet das auch, dass Du gerne, sofern Du programmieren kannst, meine Fähigkeiten verbessern oder sogar erweitern darfst. In solchen Fällen erstellst Du bestenfalls Pull-Requests, Mario kommt dann auf Dich zu.' },
                
                'quicklink': { s: 'Schnellzugriff' },
                'quicklinkdel': { s: 'Filter aufheben' },
                'quicklinknone': { s: 'Keine Filter vorhanden' },
                
                'autologouthead': { s: 'Bist Du noch da?' },
                'autologoutbody': { s: 'Falls nicht, würde ich Dich aus Sicherheitsgründen abmelden. Und zwar in **%s**.' },
                'logoutnow': { s: 'Jetzt abmelden' },
                'stayloggedin': { s: 'Angemeldet bleiben' },
                
                'search': { s: 'Suchen ...' },
                'searchnoresults': { s: 'Keine Ergebnisse' },
                'searchstudent': { s: '%d Schüler' },
                'searchcourse': { s: '%d Klasse', p: '%d Klassen', n: 2 },
                'searchcatalogue': { s: '%d Bewertungskatalog', p: '%d Bewertungskataloge', n: 2 },
                'searchcriteria': { s: '%d Einzelkriterium', p: '%d Einzelkriterien', n: 2 },
                'searchrating': { s: '%d Teilleistung', p: '%d Teilleistungen', n: 2 },
                
                'seatmap': { s: 'Sitzplan' },
                'seatmapsize': { s: 'Sitzplangröße' },
                'seatmapcreate': { s: 'Erstelle hier einen neuen Sitzplan' },
                'seatmapstart': { s: 'Nicht platziert' },
                'seatmapdel': { s: 'Willst Du %s aus dem Sitzplan entfernen?' },
                'seatmapplace': { s: 'Super, jetzt klicke noch auf einen Sitzplatz.' },
                'seatmapchoose': { s: 'Okay, Sitzplatz gewählt. Aber wer sitzt dort?' },
                'seatmapprint': { s: 'Sitzplan drucken' },
                'seatmapprintshort': { s: 'drucken' },
                'seatmapplaceall': { s: 'Platziermodus starten' },
                'seatmapclearseats': { s: 'Sitzplan leeren' },
                'seatmapclearseatsq': { s: 'Damit entferne ich alle Deine %s aus dem Sitzplan. Willst Du das?' },
                'seatmaprandom': { s: 'restliche zufällig platzieren' },
                'seatmaprandomq': { s: 'Damit verteile ich alle Deine noch nicht platzierten %s auf zufällige (leere) Plätze. Willst Du das wirklich?' },
                
                'studentemptystart': { s: 'Du hast noch keine %s. Das macht aber erstmal nichts. Die kannst du einfach in einer %s hinzufügen.' },
                
                'catalogueemptystart': { s: 'Dir fehlt definitiv ein %s. Lege am besten gleich einen an:' },
                
                'cat2criaddnew': { s: 'neu erstellen' },
                'cat2criaddexistent': { s: 'bestehendes hinzufügen' },
                'cat2criinuse': { s: 'Dieses %s wird in diesen %s verwendet' },
                
                'courseemptystart': { s: 'Hallo %s. Neu hier? Kein Problem, wir haben alle mal klein angefangen. Beginne doch damit:' },
                'coursegradeinfo': { s: 'Ich berechne diese Gesamtnoten hier als gewichtete Mittelwerte. Du kannst die Noten aber natürlich auch selbst vergeben:' },
                'coursegrade': { s: 'Noten machen' },
                'coursegradenotyet': { s: 'noch nicht bewertet' },
                'coursegradeforx': { s: 'Noten für %s machen' },
                'xtry': { s: '%d. Versuch' },
                'courseratingtryx': { s: '%d. Versuch (%d %s)' },
                'studentratingtryx': { s: '%s (%d. Versuch)' },
                'courseoverwritemanualgradeforx': { s: 'Du hast die Noten für %s schonmal händisch gemacht (damals: %s). Ich würde sie jetzt durch %s ersetzen. Soll ich Deine damalige Note überschreiben?' },
                'coursegradedesc': { s: 'Wenn Du hier Noten vergibst, merke ich mir das als **händisch vergebene Gesamtnoten**. Solltest Du später eine %s korrigieren, dann werde ich händisch vergebene Gesamtnoten nicht überschreiben (oder Dich vorher fragen). Möchtest Du das rückgängig machen, also mir wieder die Berechnung der Gesamtnote überlassen, dann kannst Du einfach den Haken beim betrefflichen %s entfernen.\n\nAlle Änderungen auf dieser Seite speichere ich übrigens unmittelbar.' },
                
                'course_add': { s: 'Alle Informationen auf dieser Seite stellen eine Vorschau dar; gespeichert wird erst bei einem Klick auf den entsprechenden Button am Ende der Seite. Während der Eingabe der %s erkennt das System zudem selbstständig, ob es dazu neue Personen erstellen oder bereits bestehende neu verlinken muss.' },
                'course_add.file': { s: 'Hier kannst Du auch eine Datei mit %s hochladen und importieren.' },
                'course_add.column_choose': { s: 'Jetzt brauche ich kurz Deine Hilfe. Welche Informationen verbergen sich denn hinter welcher Spalte Deiner Daten?' },
                'course_add.column_choose.column': { s: 'Datenspalte' },
                'course_add.column_choose.field': { s: 'Gesuchte Information' },
                'course_add.column_choose.example': { s: 'Beispiel' },
                'course_add.column_choose.option': { s: '%d. Spalte (Bsp.: %s)' },
                'course_add.column_choose.option.skip': { s: 'Spalte ignorieren' },
                'course_add.multiple_equivalent': { s: 'Hinweis: Wenn Du mehrere Personen mit ein- und demselben Namen hast, dann ändere ein Detail in deren Angaben (zum Beispiel die Bemerkung über die Person). Nur so können sowohl Du als auch ich sie auseinanderhalten.' },
                'course_add.validate': { s: 'Okay, ich bin bereit. Ich füge jetzt gleich %u, das heißt %u neue und %u bestehende,  %s hinzu. Einverstanden?' },
                
                
                'newmail': { s: 'neue Nachricht senden' },
                'mail': { s: 'Wunderbar, Nachricht wurde verschickt.', p: 'Wunderbar, Nachrichten wurden verschickt.', n: 2 },
                'send': { s: 'Senden' },
                'sendto': { s: 'Diese Nachricht schicke ich als E-Mail an %s.' },
                
                'correct': { s: 'korrigieren' },
                'correctionxdone': { s: 'Kann %s als erledigt markiert werden?' },
                'correctiondone': { s: 'Erledigt!' },
                'correction.fGrade': { s: 'Die Note musst Du hier nicht festlegen. Ich kann sie auch nachträglich und für alle nach einem bestimmten Notenschlüssel berechnen.' },
                'correctiontimesum': { s: 'Benötigte Korrekturzeit' },
                'correctiontimeavg': { s: 'Durchschnittlich benötigte Korrekturzeit' },
                'correctiontimeest': { s: 'Geschätzte restliche Korrekturzeit' },
                'correctionfilterdone': { s: 'bereits bewertet' },
                'correctionfilternotdone': { s: 'noch nicht bewertet' },
                
                'timer': { s: 'Elternsprechtagtimer' },
                'timerset': { s: 'Timer einstellen' },
                'timergo': { s: 'Los!' },
                'timerabort': { s: '(abbrechen)' },
                'timerxleft': { s: 'noch %s übrig' },
                'timerdone': { s: 'Die Zeit ist um!' },
                
                'stu2couratingchart': { s: 'Ich habe von %s in %s %d %s gespeichert. Die durchschnittliche Note ist eine %.2f. Hier siehst Du alle einzelnen Bewertungen detailliert aufgeführt.' },
                'stu2cousendrating': { s: 'Details als Nachricht senden' },
                'stu2cousendbody': { s: 'Hallo %s,\n\nim Rahmen der %s %s waren folgende Aspekte ausschlaggebend für die Benotung:\n\n%s\n\nDamit komme ich auf eine Bewertung von %d %s bzw. einer %s von %s (im %d. Versuch).\n\nBeste Grüße,\n%s' },
                'stu2cousendbodysingle': { s: '# %s\n  %d/%d %s\n  Anmerkungen: %s' },
                
                'ratingsummary': { s: '%s wurde in %s %d mal wiederholt.' },
                'ratingaverage': { s: 'In dieser %s hast Du aktuell %d von %d Arbeiten korrigiert und im Mittel %.2f Punkte (SD = %.2f) vergeben.' },
                'ratingtryaverage': { s: 'Im %s hast Du aktuell %d von %d Arbeiten korrigiert und im Mittel %.2f Punkte (SD = %.2f) vergeben.' },
                'ratingcorrecttryx': { s: 'Korrektur für Versuch %d starten/fortsetzen' },
                'ratingcorrect': { s: 'Korrektur starten/fortsetzen' },
                'ratingcalculatetryx': { s: 'Noten für Versuch %d berechnen' },
                'ratingcalculate': { s: 'Note berechnen', p: 'Noten berechnen', n: 2 },
                'ratingcalculatepos': { s: 'Noten bei bestandener Leistung' },
                'ratingcalculateneg': { s: 'Noten nicht bestandener Leistung' },
                'ratingcalculateslider': { s: 'Notenschlüssel' },
                'ratingcalculateslidervaluex': { s: 'alle %d Punkte eine neue Note beginnen' },
                'ratingcalculatepass': { s: 'Es gibt maximal %d Punkte (Minimum: %d) zu erreichen. Mit diesem Notenschlüssel werden %d Punkte (%.1f Prozent) benötigt, um diese Teilleistung zu bestehen.' },
                'ratingcalculateaction1': { s: 'Okay, berechnen ...' },
                'ratingcalculateaction2': { s: 'Jetzt berechnen' },
                'ratingcalculatevalidate': { s: 'Gut, dann berechne ich jetzt die Noten für %d %s. Ich lasse %d %s dabei außen vor, weil für diese Personen %s (%s) nicht fertig korrigiert ist.' },
                'ratingcalculateoverwrite': { s: '%s, die bereits Noten für diese Teilleistung eingetragen haben, überschreiben' },
                
                'timeago': { s: 'vor %s %s' },
                'few': { s: 'wenigen' },
                'sec': { s: 'Sekunde', p: 'Sekunden', n: 2 },
                'min': { s: 'Minute', p: 'Minuten', n: 2 },
                'hour': { s: 'Stunde', p: 'Stunden', n: 2 },
                'day': { s: 'Tag', p: 'Tagen', n: 2 },
                'week': { s: 'Woche', p: 'Wochen', n: 2 },
                'month': { s: 'Monat', p: 'Monaten', n: 2 },
                'year': { s: 'Jahr', p: 'Jahren', n: 2 },
                
                'profilepwregenerate': { s: 'Sicher, dass Du für %s ein neues Passwort generieren willst? Das neue Passwort wird dabei für Dich unsichtbar erzeugt und direkt an den Benutzer per Mail geschickt.' },
                'profilepwregeneration': { s: 'neues Passwort' },
                'profilenomails': { s: 'Bislang wurden keine Nachrichten an %s verschickt.' },
                
                'helptext.nSysId': { s: 'Wenn Du hier ein bestimmtes Notensystem vermisst, lass es [mich](mailto:hero@stuperman.org?subject=Notensystem) einfach wissen. Ich lerne die Dinger blitzschnell dazu.' },
                'helptext.nCatId': { s: 'Nicht das Richtige dabei? Erstelle einfach einen neuen Bewertungskatalog und komm\' hierher zurück.' },
                'helptext.sCategory': { s: 'Im Grunde kannst Du hier eingeben, was auch immer Dir Übersicht verschafft. Ich gruppiere Deine Daten dann einfach danach.' },
                'helptext.sGrade': { s: 'Komma-getrennte Liste aller möglichen Werte (z.B. 1.0,1.3,1.7).' },
                'helptext.sGradeFail': { s: 'Fast wie oben: Komma-getrennte Liste jener Werte, die als "nicht bestanden" gelten.' },
                
                'dontworry': { s: 'Fürchte Dich nicht! Ich bin gekommen, um zu helfen!' },
                'help': { s: 'Hilfe & Anleitungen' },
                
                'help.01.q': { s: 'Das Schuljahr geht los, ich habe zwei Klassen, was mache ich?' },
                'help.01.a': { s: 'Ganz einfach: Eine Klasse nach der anderen anlegen und jeweils die Schüler hinzufügen. Du kannst die Schüler dabei auch aus bestehenden Daten übernehmen oder aus einer Datei importieren. Wenn Schüler in beiden Klassen sitzen, dann kümmere ich mich darum, also keine Sorge.' },
                
                'help.02.q': { s: 'Ich stelle eine Schulaufgabe, wie gehe ich vor?' },
                'help.02.a': { s: 'Schulaufgaben verwalte ich als Teilleistungen. Und Teilleistungen kannst Du in der jeweiligen Klasse hinzufügen. Aus der Summe aller Teilleistungen errechne ich später die Noten; du kannst also jeder Teilleistung einen Gewichtsanteil an der Gesamtnote zuweisen.\n\nEin Beispiel: Bei drei schriftlichen und einer mündlichen Schulaufgabe kannst Du etwa jeder Teilleistung ein Viertel Gewicht geben, sodass sich die Gesamtnote zu gleichen Teilen aus den vier Teilnoten ergibt.\n\nDarüber hinaus kannst du ein passendes Notensystem und einen entsprechenden Bewertungskatalog auswählen. Das Notensystem legt fest, wie du die Schulaufgabe schlussendlich bewertest - etwa als bestanden/nicht bestanden oder als Noten von 1 bis 6. Den Bewertungskatalog definierst du komplett selbst. Er legt den Rahmen der Schulaufgabe fest, innerhalb dessen du Punkte vergibst und so zur passenden Note kommst.\n\n Schritt für Schritt bedeutet das für dich:\n1. Bewertungskatalog anlegen/auswählen\n2. Teilleistung in Klasse erstellen\n3. Gewichtung der Teilleistungen anpassen' },
                
                'help.03.q': { s: 'Ich plane das gesamte Schuljahr im Voraus, was mache ich?' },
                'help.03.a': { s: 'Das Wichtigste ist, die Klasse samt ihren Schülern anzulegen und die Schülerliste auf Vollständigkeit zu prüfen. Wenn Du darüber hinaus schon weißt, welche Tests und Teilnoten Du vergibst, dann lege diese Teilleistungen direkt an. So kannst Du immer genau sehen, welche Teilnoten noch fehlen und wo Deine Schüler aktuell gerade stehen.' },
                
                'help.04.q': { s: 'Korrigieren, aber wie?' },
                'help.04.a': { s: 'Zunächst solltest Du mir erklären, wie die Schulaufgabe aussieht und was Du damit vorhast. Also welcher Bewertungskatalog, welches Notensystem und welche Gewichtung innerhalb der Gesamtnote. Dazu legst Du einfach die Schulaufgabe als neue Teilleistung innerhalb der Klasse an.\n\nWenn Du dann darauf klickst, landest Du auf der Detailseite dieser Teilleistung. Und von dort aus kommst Du ganz einfach in den Korrekturmodus. Jetzt kommt der aufwändige Teil: Du musst die einzelnen Punktewerte eintragen. Du kannst aber die Noten hier noch frei lassen, wenn Du möchtest. Sobald Du fertig bist, kann ich Dir nämlich helfen, die Noten zu berechnen. Dafür kannst Du einen Notenschlüssen angeben, etwa, dass man mit mindestens der Hälfte der Punkte bestanden hat, und ich berechne die Noten für Dich. Fertig. Alle Noten beziehe ich übrigens direkt in die aktuelle Gesamtnote mit ein.' },
                
                'help.05.q': { s: 'Es hat sich jemand für die Sprechstunde angemeldet, was kann ich anbieten?' },
                'help.05.a': { s: 'Suche zunächst nach dem entsprechenden Schüler. Das geht am schnellsten über die Suchfunktion (ganz oben rechts). Hier findest Du jetzt alle Infos, die ich über diesen Schüler von Dir habe: Klassen, Teilleistungen, Noten, etc. Du kannst auf Klassen und Teilleistungen klicken, dann zeige ich Dir auch die zeitliche Entwicklung des Schülers.\n\nDu kannst beim Schüler auch eine neue **Unterhaltung** anlegen. Dabei hältst Du fest, dass es ein Gespräch gab und worum es im Gespräch mit der Mutter oder dem Vater ging. So weißt Du auch später noch, worüber gesprochen wurde und ob man sich auf etwas geeinigt hat. In der nächsten Sprechstunde erinnere ich Dich dann an die letzten Unterhaltungen.' },
                
                'help.06.q': { s: 'Wie kommen meine ganzen Daten jetzt zurück ins Schulsystem?' },
                'help.06.a': { s: 'Das hängt im Detail von Deinem Schulsystem ab. Grundsätzlich kann ich Dir die Daten aber problemlos als sogenannte CSV-Datei anbieten. Solche Dateien können die meisten Systeme lesen und Du kannst sie selbst mit Microsoft Excel oder OpenOffice Calc oder Google Sheets oder einem anderen Tabellenverarbeitungsprogramm öffnen. Du kannst CSV-Dateien sowohl in der Klassenübersicht als auch für jede Teilleistung separat herunterladen.' },
                
                'help.07.q': { s: 'Ich bin verwirrt: Klassen, Noten, Teilleistungen, Punkte, ...?' },
                'help.07.a': { s: 'Das kann ich verstehen. Aber ist nicht sonderlich kompliziert, man muss nur einmal den Knoten im Hirn aufbekommen.\n\nLass es mich an einem Beispiel erklären: Maribell ist Lehrerin und ich, Stuperman, helfe ihr bei der Verwaltung. Hier mal ihre Eckdaten:\n- Maribell unterrichtet drei Fächer in zwei Klassen\n  - in der 9a Mathe und Physik\n  - in der 7b Mathe\n- Maribell vergibt je Fach eine mündliche und mehrere schriftliche Noten\n  - in Mathe gibt es vier Schulaufgaben, dazu noch zwei kleine Tests\n  - in Physik stellt Maribell vier Tests, außerdem müssen die Schüler ein Projekt absolvieren, das benotet wird\n\n##Klassen und Schüler\nMaribell erstellt drei **Klassen**, einmal die 9a in Mathe, einmal die 9a in Physik und einmal die 7b in Mathe. Jeder dieser Klassen fügt sie anschließend alle entsprechenden Schüler hinzu - ich erkenne dabei selbstständig, dass die Schüler der 9a in Physik und Mathe dieselben sind.\n\n##Noten und Teilleistungen\nIn jeder Klasse kann Maribell jetzt ihre Teilleistungen anlegen, also all jene Dinge, die am Schuljahresende die Note bilden. Für die beiden Mathe-Klassen sind das also je sieben Teilleistungen (vier Schulaufgaben, zwei Tests, eine mündliche Note), in Physik sind es sechs (vier Tests, ein Projekt, eine mündliche Note). Aus diesen Teilleistungen errechne ich später für jeden Schüler eine Gesamtnote.\n\n##Punkte und Bewertungskataloge\nFür die einzelnen Teilleistungen hat Maribell jeweils unterschiedliche Strategien, wie sie zu ihren Noten kommt. In die mündliche Note fließt etwa ein, wie gut (Qualität) und wie häufig (Quantität) Schüler mitarbeiten. Ihre Schüler können bei Maribell über das Schuljahr jeweils bis zu zehn Punkte erreichen, die dann eben die mündliche Note ergeben. Sie erstellt also einen neuen Bewertungskatalog, "mündlich", und legt darin zwei Kriterien, "Qualität" und "Quantität", an. Vergibt sie hier Punkte für einzelne Schüler, kann ich später mündliche Noten daraus berechnen, die ich wiederum, am Schuljahresende, in die Gesamtnote einbeziehen kann.\n\nNoch ein Beispiel: Beim ersten Physik-Test bewertet Maribell jede Frage im Test einzeln. Ihr Kriterienkatalog "Physik-Test, 9. Klasse, lineare Bewegungen" besteht also aus acht Fragen, die sie jeweils als Kriterien anlegt. Aus den so erreichten Punktezahlen in diesem Test kann ich wiederum Testnoten berechnen, die später in die Gesamtnote fließen.\n\n##Zusammenfassung\nIn Klassen organisierst Du Deinen Unterricht, der am Schuljahresende auf Noten rausläuft. Diese Noten errechne ich aus Teilleistungen (z.B. Tests, mündlichen Noten, etc.). Und jede Teilleistung ergibt sich auf Basis zahlreicher Kriterien, die ich in sogenannten Kriterienkatalogen zusammenfasse.\n\nÜbrigens: Diese Kriterienkataloge kannst Du so ohne weiteres auch mehrfach verwenden.' },
                
                'help.08.q': { s: 'Ich würde gerne Anwesenheitslisten führen, diese aber nicht "benoten". Geht das?' },
                'help.08.a': { s: 'Ja, über einen kleinen Umweg. Du kannst Anwesenheiten ebenfalls als **Teilleistung** anlegen. Wenn Du diese Teilleistung mit einem Gewicht von 0 versiehst, werde ich sie dann nicht bei der Notenberechnung berücksichtigen. Einen Kriterienkatalog brauchst Du aber trotzdem.' },
                
                'help.09.q': { s: 'Einige Schüler müssen eine Schulaufgabe ("Teilleistung") __nachholen__. Was tun?' },
                'help.09.a': { s: 'Teilleistungen lassen sich wiederholen. Dazu öffnest Du zunächst die Klasse, scrollst zu den Teilaufgaben und erstellst einen neuen "Versuch". Dabei frage ich Dich, welche Schüler denn Teil dieser Wiederholung sein sollen. Dafür biete ich Dir auch diverse Hilfestellungen an (z.B. alle Schüler, die im ersten Versuch durchgefallen sind). Du kannst diese Auswahl auch später noch überarbeiten.\n\nEinmal hinzugefügt, kannst Du diese Wiederholung ganz normal korrigieren, wie Du auch sonst Teilleistungen korrigierst. Ich berücksichtige fortan für jeden Schüler immer die letzte Wiederholung, die Du eingetragen hast.\n\n##Anschlussfrage: Warum so kompliziert?\nDas hat mit meinen Berechnungen zu tun. Wenn Du einfach eine neue Teilleistung erstellst (z.B. eine "Wiederholung Schulaufgabe 1"), dann beziehe ich die genauso in die Berechnung der Gesamtnote mit ein wie die eigentliche "Schulaufgabe 1". Mit anderen Worten: Wenn ein Schüler zunächst durch die "Schulaufgabe 1" durchfällt und die Note 5 erhält, in der "Wiederholung Schulaufgabe 1" dann aber eine 3 schreibt, dann sollte der Schüler aktuell auf der Gesamtnote 3 stehen (und nicht etwa auf 4, dem Mittelwert aus 3 und 5). Damit solche Verwirrung gar nicht erst aufkommt, handhabe ich Wiederholer auf spezielle Art und Weise.\n\n##Noch eine Anschlussfrage: Kannst Du auch mit der besten (anstatt der letzten) Wiederholung eines Schüler rechnen?\nDas mache ich nicht automatisch, weil das zu verwirrend wäre. Aber Du kannst einfach selbst Noten vergeben und so für einzelne Schüler die beste Teilleistung einberechnen.' },
                
                'help.10.q': { s: 'Was hat es mit den __Nachrichten__ auf sich, die Du mir immer wieder anbietest' },
                'help.10.a': { s: 'Wenn Du bei Personen eine E-Mail-Adresse hinterlegt hast, kann ich diesen Personen Nachrichten (also E-Mails) schicken.\n\nVielleicht willst Du ihnen zum Beispiel die einzelnen Bewertungskommentare schicken, die Du bei einer Korrektur vergeben hast. In diesem Fall musst Du die einzelnen Kommentare nicht rauskopieren, sondern ich kann diese Mail für Dich verschicken.\n\nDu kannst auch selbst Nachrichten verfassen und Sie an einzelne Personen verschicken. Möglicherweise willst Du ihnen schriftlich sagen, was beim letzten Treffen besprochen wurde.\n\nDer Vorteil von E-Mails, die Du über mich verschicken lässt, ist übrigens der, dass ich diese E-Mails auch für Dich archiviere und sie Dir bei passenden Gelegenheiten anzeige. So siehst Du etwa in Sprechstunden direkt, wann Du welche Nachricht an diese Person verschickt hast. Ob die Nachricht auch tatsächlich gelesen wurde, kann ich Dir aus technischen Gründen aber leider nicht versprechen.' },
                
                'help.11.q': { s: 'Kannst du mir auch mit einem Sitzplan helfen?' },
                'help.11.a': { s: 'Oh ja, das kann ich. Für jede Deiner Gruppen kann ich mir einen Sitzplan merken. Den legst Du einfach innerhalb einer Gruppe an. Ich rate zunächst eine adäquate Größe, Du kannst den Sitzplan aber auch problemlos in seiner Größe ändern. Anschließend "setzt" Du einfach die einzelnen Personen an die passenden Plätze. Wie Du dabei das Raster betrachtest, bleibt natürlich Dir überlassen (also ob die Tafel rechts oder vorne oder sonstwo ist).\n\nPersonen wieder zu löschen, funktioniert übrigens genauso einfach: Klicke den zu löschenden Platz einfach an und bestätige das Entfernen.\n\nDu kannst den Sitzplan auch in passender Größe ausdrucken, sogar mit Fotos, wenn du welche hinterlegt hast. Und ich kann den Sitzplan für Dich auch zufällig auffüllen. So sorgst Du für etwas Abwechslung (und damit hoffentlich etwas mehr Ruhe) im Raum, wenn Du die TeilnehmerInnen aufforderst, sich nach einem zufällig gemischten Sitzplan zu richten.' },
                
                'help.12.q': { s: 'Ich merke mir Namen so schlecht. Wie sieht es mit Fotos aus?' },
                'help.12.a': { s: 'Fotos Deiner TeilnehmerInnen? Klar. Öffne einfach eine Person und klicke auf das graue Foto-Symbol oben rechts. Dann öffnet sich ein Fenster, in dem Du das Foto hochladen oder einfach einfügen kannst. Wenn Du mich vom Smartphone aus benutzt, kannst Du an der Stelle auch einfach ein Foto schießen. Solange die Fotos bei Dir bleiben, ist das mit dem Datenschutz kein großes Problem - fotografierte Personen kriegen ja mit, wenn sie fotografiert werden. Veröffentlichen darfst Du die Fotos natürlich nicht. Und apropos **Datenschutz**: Sämtliche Fotos speichere ich selbstverständlich verschlüsselt ab, damit da nichts passieren kann.\n\nUnd noch was: Einmal bebildert, tauchen diese Bilder immer wieder auf. Ich baue sie zum Beispiel in den Sitzplan ein, den Du Dir auch ausdrucken kannst. Mit Fotos und Namen, damit Du sie auch wirklich lernst.' },
                
                'help.13.q': { s: 'Im Gebäude habe ich leider kein Internet. Kannst du mir trotzdem helfen, Stuperman?' },
                'help.13.a': { s: 'Ja, das kann ich. Du musst mich allerdings erstmal mit einer Internetverbindung auf dem Gerät starten, auf dem später mit mir auch ohne Internet arbeiten willst. Angenommen, Du willst mich mit zur Sprechstunde in die Schule nehmen (Kein Internet!), dann schlage ich vor, dass Du mich auf einem Notebook oder Tablet-Computer nutzt. Mit demselben Notebook oder Tablet-Computer musst Du im Vorfeld der Sprechstunde schon einmal mit mir arbeiten (Mit Internet!). Wenn Du mich einmal geladen hast, kannst Du mich mit demselben Gerät aber problemlos offline nutzen. Die Daten, die Du in dieser Zeit ohne Internet änderst, merke ich mir. Sobald ich wieder Internet bekomme, speichere ich diese Informationen dann wieder ganz normal dort, wo auch die anderen Infos lagern.\n\nÜbrigens: Ich bin auch super mit dem Smartphone nutzbar. Also falls Du zum Beispiel mobiles Internet aber kein W-LAN hast.' },
                
                'help.14.q': { s: 'Kann ich mein Passwort ändern?' },
                'help.14.a': { s: 'Klar, das solltest Du sogar von Zeit zu Zeit. Klicke einfach auf die kleine Figur ganz oben rechts.' },
                
                'help.15.q': { s: 'Ich habe eine (technische) Frage, Stuperman. Kann ich dir die auch persönlich stellen?' },
                'help.15.a': { s: 'Das kannst Du. Kontaktmöglichkeiten findest Du im Impressum am Ende einer jeden Seite.' },
                
                'help.16.q': { s: 'Einige meiner Kollegen sind ganz neidisch auf mich. Kannst Du denen nicht auch helfen?' },
                'help.16.a': { s: 'Vermutlich schon. Sag\' ihnen einfach, sie sollen mich unter [stuperman.org](https://stuperman.org) kontaktieren. Dort gibt es ein Kontaktformular, über das man meine Dienste anfordern kann. Kostenfrei, selbstverständlich.' },
                
                
                'error': { s: 'Fehler' },
                'error.norecipient': { s: 'Oha. Zu dieser Person habe ich keine E-Mail-Adresse, an die ich diese Nachricht schicken könnte.' },
                'error.nr': { s: 'Ups, das ist keine Zahl.' },
                'error.string': { s: 'Ups, hier wird eine Texteingabe erwartet.' },
                'error.add': { s: '%s konnte nicht erstellt werden.' },
                'error.misinformation': { s: 'Sorry, da fehlt noch eine Angabe.', p: 'Sorry, da fehlen noch ein paar Angaben.', n: 2 },
                'error.mail': { s: 'Tut mir leid, aber irgendwas hält mich gerade davon ab, diese Nachricht zu senden. Probier\'s bestenfalls (später) nochmals.' },
                'error.login': { s: 'Hmm, hast Du Dich vielleicht vertippt? Jedenfalls kann ich Dich gerade nicht anmelden.' },
                'error.delete': { s: 'Ohje, da ist ein Fehler während des Löschens aufgetreten!' },
                'error.update': { s: 'Uh-oh ... beim Aktualisieren dieser Daten ist mir ein Fehler unterlaufen.' },
                'error.duplicate': { s: 'Huch, %s wurde bereits hinzugefügt.' },
                'error.import': { s: 'Das tut mir leid, aber die eingefügten Informationen kann ich nicht verarbeiten.' },
                'error.notallratings': { s: 'Es gibt da jetzt blöderweise ein Problem, da nicht alle Einträge zugehörige Einträge haben und, naja, also jedenfalls rate ich dir, erstmal die Seite neu zu laden. Sollte das nicht helfen, kannst du auch den Support kontaktieren.' },
                'error.entrynotfound': { s: 'Jetzt bin ich äußerst peinlich berührt, aber ich kann den gesuchten Eintrag nicht finden.' },
                'error.outofrange': { s: 'Neinneinnein, Du hast den Wertebereich selbst auf %.2f-%.2f festgelegt. Da musst Du Dich jetzt auch dran halten.' },
                'error.reload': { s: 'Ach, Mensch, da ist jetzt was schief gelaufen. Aber vermutlich nichts schlimmes. Probiere es einfach nochmal.' },
                'error.passwordempty': { s: 'Das Passwort darf nicht leer sein.' },
                'error.passwordunequal': { s: 'Die Passwörter stimmen nicht überein.' },
                'error.passwordtooshort': { s: 'Das Passwort muss mindestens %d Zeichen lang sein.' },
                'error.passwordmisseslower': { s: 'Zur Sicherheit muss das Passwort Kleinbuchstaben enthalten.' },
                'error.passwordmissesupper': { s: 'Zur Sicherheit muss das Passwort Großbuchstaben enthalten.' },
                'error.passwordmissesnr': { s: 'Zur Sicherheit muss das Passwort Ziffern enthalten.' },
                'error.ratingcalculatepointsmissing': { s: 'Folgende Punktezahlen haben keine Note zugeteilt: %s' },
                'error.ratingcalculateduplicategrades': { s: 'Punktebereich nicht eindeutig.' },
                'error.ratingcalculatemin': { s: 'Punktezahl außerhalb des gültigen Bereichs' },
                'error.ratingcalculateupdate': { s: 'Fehler beim Speichern' },
                'error.ratingcalculateoverall': { s: 'Fehler beim Berechnen der Gesamtnote' },
                'error.data.deletechild': { s: 'Unterelement (%s,  #%d) konnte nicht gelöscht werden.' },
                'error.data.foreign': { s: 'Foreign Key nicht gefunden für %s (#%d).' },
                'error.data.offlinepw': { s: 'Stuperman ist offline und kann daher keine Passwörter ändern.' },
                'error.data.offlinemail': { s: 'Stuperman ist offline und kann daher keine Mails versenden.' },
                'error.data.offlinedata': { s: 'Stuperman ist offline, kann aber auch lokal keine Daten finden und damit leider nicht arbeiten.' }
            },
            university: {
                student: { s: 'Student', p: 'Studierende', n: 2 },
                course: { s: 'Veranstaltung', p: 'Veranstaltungen', n: 2 },
                sNr: { s: 'Matrikelnummer', p: 'Matrikelnummern', n: 2 },
                sCategory: { s: 'Semester' },
            
                'searchstudent': { s: '%d Studierender', p: '%d Studierende', n: 2 },
                'searchcourse': { s: '%d Veranstaltung', p: '%d Veranstaltungen', n: 2 },
                
                'timer': { s: 'Sprechstundentimer' }
            }
        }
    };
    
    /**
     * Returns a single word in the current translation.
     *
     * @param   _sWord  name of the word to be returned
     * @param   _nPluralIndiciator  a number, indicating whether to return the plural of a word (if available)
     * @return  string  the word in the current language and correct form
     */
    export function get(_sWord: string, _nPluralIndicator?: number) {
        let oWord: any = null;
        if(typeof(oI18n[sLanguage][sDialect][_sWord]) === 'undefined') {
            if(typeof(oI18n[sLanguage][sDialectDefault][_sWord]) !== 'undefined') {
                oWord = oI18n[sLanguage][sDialectDefault][_sWord];
            } else if(typeof(oI18n[sLanguageDefault][sDialect][_sWord]) !== 'undefined') {
                oWord = oI18n[sLanguageDefault][sDialect][_sWord];
            } else if(typeof(oI18n[sLanguageDefault][sDialectDefault][_sWord]) !== 'undefined') {
                oWord = oI18n[sLanguageDefault][sDialectDefault][_sWord];
            }
        } else {
            oWord = oI18n[sLanguage][sDialect][_sWord];
        }
        if(oWord === null) {
            return '';
        } else {
            return typeof(_nPluralIndicator) !== 'undefined' && (_nPluralIndicator >= oWord['n'] || _nPluralIndicator === 0) && typeof(oWord['p']) !== 'undefined' ? oWord['p'] : oWord['s'];
        }
    }
    
    /**
     * Returns a single sentence in the current translation and inserts the words accordingly.
     * The raw sentence could also be fetched using i18n.get(...), however, this function replaces all necessary replacements.
     * Other parameters need to be resolved already.
     *
     * @param   _sSentence  name of the sentence to be used
     * @param   ... all words to be put into the sentence (they are replaced directly, no i18n.get(...) is called)
     * @return  string  full sentence in current language
     */
    export function sentence(_sSentence: string, ..._aWord: any[]) {
        return vprintf(get(_sSentence), _aWord);
    }
    
    /**
     * Just like sentence(...) but the sentence itself can be in plural as well.
     *
     * @param   _sSentence  name of the sentence to be used
     * @param   _nPluralIndicator  a number, indicating whether to return the plural of a word (if available)
     * @param   ... all words to be put into the sentence (they are replaced directly, no i18n.get(...) is called)
     * @return  string  full sentence in current language
     */
    export function pluralsentence(_sSentence: string, _nPluralIndicator: number, ..._aWord: any[]) {
        return vprintf(get(_sSentence, _nPluralIndicator), _aWord);
    }
    
    /**
     * Fills a string with replacements, following common rules as of http://php.net/manual/de/function.sprintf.php
     *
     * @param   _sBase  the basic string to work on
     * @param   _aReplacement   all replacements
     * @return  string
     */
    export function sprintf(_sBase: string, ..._aReplacement: any[]) {
        return vprintf(_sBase, _aReplacement);
    }
    
    function vprintf(_sBase: string, _aReplacement: any[]) {
        let nCount = 0;
        return _sBase.replace(
                /%([+-])?(0)?([+-])?(\.[0-9]+)*([bcdeEfFgGosuxX])?/g,
                ( _sSpecifier: string, 
                    _sSign: string, 
                    _sFill: string, 
                    _sOrientation: string, 
                    _sLength: string,
                    _sType: string,
                    ..._aParam: any[]) => {
                    
                    if(typeof(_aReplacement[nCount]) === 'undefined') {
                        return '';
                    } else {
                        let mValue = _aReplacement[nCount];
                        nCount++;
                        switch(_sType || 's') {
                            case 'b':
                                mValue = (parseInt(mValue) ? true : false).toString();
                                break;
                            case 'c':
                                mValue = String.fromCharCode(parseInt(mValue));
                                break;
                            case 'e':
                            case 'E':
                                //space between variable and .toExponential necessary as otherwise interpreted as floating point
                                mValue = +mValue .toExponential(+_sLength.substr(1))
                                                 .toString()
                                                 .replace('e', _sType);
                                break;
                            case 'f':
                                mValue = (+mValue).toFixed(+_sLength.substr(1))
                                                 .toString();
                                break;
                            case 'F':
                                mValue = (+mValue).toFixed(+_sLength.substr(1))
                                                 .toString();
                                if(sLanguage.substr(0, 2) == 'de') {
                                    mValue = mValue.replace('.', ',');
                                }
                                break;
                            case 'g':
                                mValue = (+mValue .toExponential(+_sLength.substr(1)))
                                                  .toString();
                                let mValueAlternative = (+mValue .toFixed(+_sLength.substr(1)))
                                                                 .toString();
                                if(mValueAlternative.length <= mValue.length) {
                                    mValue = mValueAlternative;
                                }
                                break;
                            case 'G':
                                mValue = (+mValue .toExponential(+_sLength.substr(1)))
                                                  .toString()
                                                  .replace('e', 'E');
                                let mValueAlternativeG = (+mValue .toFixed(+_sLength.substr(1)))
                                                                 .toString();
                                if(sLanguage.substr(0, 2) == 'de') {
                                    mValueAlternativeG = mValueAlternativeG.replace('.', ',');
                                }
                                if(mValueAlternativeG.length <= mValue.length) {
                                    mValue = mValueAlternativeG;
                                }
                                break;
                            case 'o':
                                mValue = mValue.toString(8);
                                break;
                            case 'd':
                                mValue = parseInt(mValue).toString();
                                break;
                            case 'u':
                                mValue = Math.abs(parseInt(mValue)).toString();
                                break;
                            case 'x':
                                mValue = mValue.toString(16);
                                break;
                            case 'X':
                                mValue = mValue.toString(16).toUpperCase();
                                break;
                            case 's':
                                mValue = mValue.toString();
                                if(_sLength) {
                                    let nLength = +_sLength.substr(1);
                                    if(nLength > 0 && mValue.length > nLength)  {
                                        mValue = mValue.substr(0, nLength) + '...';
                                    }
                                }
                                break;
                        }
                        return mValue;
                    }
                }
            );
    }
    
    export function getLanguageOptions() {
        let aLanguage: string[] = [];
        for(let sLanguage in oI18n) {
            aLanguage.push(sLanguage);
        }
        aLanguage.sort();
        return aLanguage;
    }
    
    export function getDialectOptions() {
        let aDialect: string[] = [];
        for(let sDialect in oI18n[sLanguageDefault]) {
            aDialect.push(sDialect);
        }
        aDialect.sort();
        return aDialect;
    }
    
    export function setLanguage(_sLanguage: string) {
        if(typeof(oI18n[_sLanguage]) !== 'undefined') {
            sLanguage = _sLanguage;
            return true;
        } else {
            return false;
        }
    }

    export function setDialect(_sDialect: string) {
        if(typeof(oI18n[sLanguage][_sDialect]) !== 'undefined' || typeof(oI18n[sLanguageDefault][_sDialect]) !== 'undefined') {
            sDialect = _sDialect;
            return true;
        } else {
            return false;
        }
    }
}
    