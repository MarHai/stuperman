SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `cat2cri` (
  `nC2CId` int(11) UNSIGNED NOT NULL,
  `nCatId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `nCriId` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `nSort` int(11) UNSIGNED NOT NULL,
  `dCreate` int(35) UNSIGNED NOT NULL,
  `dUpdate` int(35) UNSIGNED NOT NULL,
  `bArchive` tinyint(2) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `catalogue` (
  `nCatId` int(11) UNSIGNED NOT NULL,
  `nUseId` int(11) UNSIGNED NOT NULL,
  `sName` text NOT NULL,
  `sNote` text NOT NULL,
  `dCreate` int(35) UNSIGNED NOT NULL,
  `dUpdate` int(35) UNSIGNED NOT NULL,
  `bArchive` tinyint(2) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `course` (
  `nCouId` int(11) UNSIGNED NOT NULL,
  `nUseId` int(11) UNSIGNED NOT NULL,
  `sName` text NOT NULL,
  `nWidth` int(3) UNSIGNED DEFAULT NULL,
  `nHeight` int(3) UNSIGNED DEFAULT NULL,
  `dCreate` int(35) UNSIGNED NOT NULL,
  `dUpdate` int(35) UNSIGNED NOT NULL,
  `sCategory` text NOT NULL,
  `bArchive` tinyint(2) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `criteria` (
  `nCriId` int(11) UNSIGNED NOT NULL,
  `sName` varchar(50) NOT NULL,
  `sNote` text NOT NULL,
  `nMin` int(5) NOT NULL DEFAULT '1',
  `nMax` int(5) NOT NULL DEFAULT '10',
  `bOptional` tinyint(2) UNSIGNED NOT NULL DEFAULT '0',
  `dCreate` int(35) UNSIGNED NOT NULL,
  `dUpdate` int(35) UNSIGNED NOT NULL,
  `bArchive` tinyint(2) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `email` (
  `nEmaId` int(11) UNSIGNED NOT NULL,
  `nUseId` int(11) UNSIGNED NOT NULL,
  `nRecipientUseId` int(11) UNSIGNED DEFAULT NULL,
  `nRecipientStuId` int(11) UNSIGNED DEFAULT NULL,
  `sRecipient` text NOT NULL,
  `sSubject` text NOT NULL,
  `sMail` text NOT NULL,
  `sHeader` text NOT NULL,
  `dCreate` int(35) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `grade` (
  `nGraId` int(11) UNSIGNED NOT NULL,
  `nC2CId` int(11) UNSIGNED NOT NULL,
  `nS2RId` int(11) UNSIGNED NOT NULL,
  `fPoints` decimal(5,2) UNSIGNED DEFAULT NULL,
  `sNote` text NOT NULL,
  `dCreate` int(35) UNSIGNED NOT NULL,
  `dUpdate` int(35) UNSIGNED NOT NULL,
  `bArchive` tinyint(2) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `rating` (
  `nRatId` int(11) UNSIGNED NOT NULL,
  `sName` varchar(50) NOT NULL,
  `sNote` text NOT NULL,
  `nCouId` int(11) UNSIGNED NOT NULL,
  `nCatId` int(11) UNSIGNED NOT NULL,
  `nSysId` int(11) UNSIGNED NOT NULL,
  `fWeight` decimal(5,2) UNSIGNED NOT NULL,
  `nSort` int(11) UNSIGNED NOT NULL,
  `dCreate` int(35) UNSIGNED NOT NULL,
  `dUpdate` int(35) UNSIGNED NOT NULL,
  `bArchive` tinyint(2) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `stu2cou` (
  `nS2CId` int(11) UNSIGNED NOT NULL,
  `nStuId` int(11) UNSIGNED NOT NULL,
  `nCouId` int(11) UNSIGNED NOT NULL,
  `fGrade` decimal(5,2) UNSIGNED DEFAULT NULL,
  `bGradeManual` tinyint(2) UNSIGNED NOT NULL DEFAULT '0',
  `nPosX` int(2) UNSIGNED DEFAULT NULL,
  `nPosY` int(2) UNSIGNED DEFAULT NULL,
  `dCreate` int(35) UNSIGNED NOT NULL,
  `dUpdate` int(35) UNSIGNED NOT NULL,
  `bArchive` tinyint(2) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `stu2rat` (
  `nS2RId` int(11) UNSIGNED NOT NULL,
  `nS2CId` int(11) UNSIGNED NOT NULL,
  `nRatId` int(11) UNSIGNED NOT NULL,
  `fGrade` decimal(5,2) DEFAULT NULL,
  `nTry` int(2) UNSIGNED NOT NULL DEFAULT '1',
  `sNote` text NOT NULL,
  `nCorrectionDuration` int(35) UNSIGNED NOT NULL DEFAULT '0',
  `bDone` tinyint(2) UNSIGNED NOT NULL DEFAULT '0',
  `dCreate` int(35) UNSIGNED NOT NULL,
  `dUpdate` int(35) UNSIGNED NOT NULL,
  `bArchive` tinyint(2) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `student` (
  `nStuId` int(11) UNSIGNED NOT NULL,
  `nUseId` int(11) UNSIGNED NOT NULL,
  `sName` text NOT NULL,
  `sMail` text NOT NULL,
  `sNr` text NOT NULL,
  `sNote` text NOT NULL,
  `sImage` mediumtext NOT NULL,
  `dCreate` int(35) UNSIGNED NOT NULL,
  `dUpdate` int(35) UNSIGNED NOT NULL,
  `bArchive` tinyint(2) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `system` (
  `nSysId` int(11) UNSIGNED NOT NULL,
  `sGroup` varchar(100) NOT NULL,
  `sName` varchar(100) NOT NULL,
  `sGrade` varchar(150) NOT NULL,
  `sGradeBest` varchar(30) NOT NULL,
  `sGradeFail` varchar(50) NOT NULL,
  `dCreate` int(35) UNSIGNED NOT NULL,
  `dUpdate` int(35) UNSIGNED NOT NULL,
  `bArchive` tinyint(2) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `talk` (
  `nTalId` int(11) UNSIGNED NOT NULL,
  `nUseId` int(11) UNSIGNED NOT NULL,
  `nStuId` int(11) UNSIGNED DEFAULT NULL,
  `sName` text NOT NULL,
  `sNote` text NOT NULL,
  `dCreate` int(35) UNSIGNED NOT NULL,
  `dUpdate` int(35) UNSIGNED NOT NULL,
  `bArchive` tinyint(2) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

CREATE TABLE `user` (
  `nUseId` int(11) UNSIGNED NOT NULL,
  `sUser` varchar(50) NOT NULL,
  `sName` text NOT NULL,
  `sMail` text NOT NULL,
  `sPassword` varchar(100) NOT NULL,
  `bOfflineSync` tinyint(2) UNSIGNED NOT NULL DEFAULT '0',
  `eLanguage` enum('de_DE') NOT NULL DEFAULT 'de_DE',
  `eDialect` enum('school','university') NOT NULL DEFAULT 'school',
  `dCreate` int(35) UNSIGNED NOT NULL,
  `dUpdate` int(35) UNSIGNED NOT NULL,
  `bArchive` tinyint(2) UNSIGNED NOT NULL DEFAULT '0',
  `bAdmin` tinyint(2) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `cat2cri`
  ADD PRIMARY KEY (`nC2CId`),
  ADD KEY `cat2cri catalogue` (`nCatId`),
  ADD KEY `cat2cri criteria` (`nCriId`);

ALTER TABLE `catalogue`
  ADD PRIMARY KEY (`nCatId`),
  ADD KEY `catalogue-user` (`nUseId`);

ALTER TABLE `course`
  ADD PRIMARY KEY (`nCouId`),
  ADD KEY `course-user` (`nUseId`);

ALTER TABLE `criteria`
  ADD PRIMARY KEY (`nCriId`);

ALTER TABLE `email`
  ADD PRIMARY KEY (`nEmaId`),
  ADD KEY `email-user` (`nUseId`),
  ADD KEY `email-recipient_user` (`nRecipientUseId`),
  ADD KEY `email-recipient_student` (`nRecipientStuId`);

ALTER TABLE `grade`
  ADD PRIMARY KEY (`nGraId`),
  ADD KEY `grade cat2cri` (`nC2CId`),
  ADD KEY `grade stu2rat` (`nS2RId`);

ALTER TABLE `rating`
  ADD PRIMARY KEY (`nRatId`),
  ADD KEY `rating course` (`nCouId`),
  ADD KEY `rating catalogue` (`nCatId`),
  ADD KEY `rating system` (`nSysId`);

ALTER TABLE `stu2cou`
  ADD PRIMARY KEY (`nS2CId`),
  ADD KEY `nStuId_nCouId` (`nStuId`,`nCouId`),
  ADD KEY `stu2cou course` (`nCouId`);

ALTER TABLE `stu2rat`
  ADD PRIMARY KEY (`nS2RId`),
  ADD KEY `stu2rat rating` (`nRatId`),
  ADD KEY `stu2rat stu2cou` (`nS2CId`);

ALTER TABLE `student`
  ADD PRIMARY KEY (`nStuId`),
  ADD KEY `student-user` (`nUseId`);

ALTER TABLE `system`
  ADD PRIMARY KEY (`nSysId`);

ALTER TABLE `talk`
  ADD PRIMARY KEY (`nTalId`),
  ADD KEY `talk-user` (`nUseId`),
  ADD KEY `talk-student` (`nStuId`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`nUseId`),
  ADD UNIQUE KEY `sName` (`sUser`,`bArchive`);


ALTER TABLE `cat2cri`
  MODIFY `nC2CId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `catalogue`
  MODIFY `nCatId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `course`
  MODIFY `nCouId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `criteria`
  MODIFY `nCriId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `email`
  MODIFY `nEmaId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `grade`
  MODIFY `nGraId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `rating`
  MODIFY `nRatId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `stu2cou`
  MODIFY `nS2CId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `stu2rat`
  MODIFY `nS2RId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `student`
  MODIFY `nStuId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `system`
  MODIFY `nSysId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `talk`
  MODIFY `nTalId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `user`
  MODIFY `nUseId` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;


ALTER TABLE `cat2cri`
  ADD CONSTRAINT `cat2cri catalogue` FOREIGN KEY (`nCatId`) REFERENCES `catalogue` (`nCatId`),
  ADD CONSTRAINT `cat2cri criteria` FOREIGN KEY (`nCriId`) REFERENCES `criteria` (`nCriId`);

ALTER TABLE `catalogue`
  ADD CONSTRAINT `catalogue-user` FOREIGN KEY (`nUseId`) REFERENCES `user` (`nUseId`);

ALTER TABLE `course`
  ADD CONSTRAINT `course-user` FOREIGN KEY (`nUseId`) REFERENCES `user` (`nUseId`);

ALTER TABLE `email`
  ADD CONSTRAINT `email-recipient_student` FOREIGN KEY (`nRecipientStuId`) REFERENCES `student` (`nStuId`),
  ADD CONSTRAINT `email-recipient_user` FOREIGN KEY (`nRecipientUseId`) REFERENCES `user` (`nUseId`),
  ADD CONSTRAINT `email-user` FOREIGN KEY (`nUseId`) REFERENCES `user` (`nUseId`);

ALTER TABLE `grade`
  ADD CONSTRAINT `grade cat2cri` FOREIGN KEY (`nC2CId`) REFERENCES `cat2cri` (`nC2CId`),
  ADD CONSTRAINT `grade stu2rat` FOREIGN KEY (`nS2RId`) REFERENCES `stu2rat` (`nS2RId`);

ALTER TABLE `rating`
  ADD CONSTRAINT `rating catalogue` FOREIGN KEY (`nCatId`) REFERENCES `catalogue` (`nCatId`),
  ADD CONSTRAINT `rating course` FOREIGN KEY (`nCouId`) REFERENCES `course` (`nCouId`),
  ADD CONSTRAINT `rating system` FOREIGN KEY (`nSysId`) REFERENCES `system` (`nSysId`);

ALTER TABLE `stu2cou`
  ADD CONSTRAINT `stu2cou course` FOREIGN KEY (`nCouId`) REFERENCES `course` (`nCouId`),
  ADD CONSTRAINT `stu2cou student` FOREIGN KEY (`nStuId`) REFERENCES `student` (`nStuId`);

ALTER TABLE `stu2rat`
  ADD CONSTRAINT `stu2rat rating` FOREIGN KEY (`nRatId`) REFERENCES `rating` (`nRatId`),
  ADD CONSTRAINT `stu2rat stu2cou` FOREIGN KEY (`nS2CId`) REFERENCES `stu2cou` (`nS2CId`);

ALTER TABLE `student`
  ADD CONSTRAINT `student-user` FOREIGN KEY (`nUseId`) REFERENCES `user` (`nUseId`);

ALTER TABLE `talk`
  ADD CONSTRAINT `talk-student` FOREIGN KEY (`nStuId`) REFERENCES `student` (`nStuId`),
  ADD CONSTRAINT `talk-user` FOREIGN KEY (`nUseId`) REFERENCES `user` (`nUseId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
