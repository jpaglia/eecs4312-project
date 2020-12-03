CREATE TABLE `schooldb1`.`Students` (
  `studentId` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`studentId`));

CREATE TABLE `schooldb1`.`Class` (
  `classId` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `school` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`classId`));

ALTER TABLE `schooldb1`.`Class` 
CHANGE COLUMN `classId` `classId` INT NOT NULL AUTO_INCREMENT ;

CREATE TABLE `schooldb1`.`Accounts` (
  `accountId` INT NOT NULL AUTO_INCREMENT,
  `creationDate` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `school` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`accountId`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);

CREATE TABLE `Attendance` (
  `attendanceId` int NOT NULL AUTO_INCREMENT,
  `date` varchar(45) NOT NULL,
  `Class_classId` int NOT NULL,
  `Student_studentId` int NOT NULL,
  `status` varchar(45) NOT NULL,
  `reason` varchar(45) DEFAULT NULL,
  `verified` tinyint NOT NULL DEFAULT '0',
  `notified` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`attendanceId`),
  KEY `studentId_idx` (`Student_studentId`),
  KEY `classId_idx` (`Class_classId`),
  CONSTRAINT `classId` FOREIGN KEY (`Class_classId`) REFERENCES `Class` (`classId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `studentId` FOREIGN KEY (`Student_studentId`) REFERENCES `Students` (`studentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `schooldb1`.`Student_has_Parent` (
  `Student_studentId` INT NOT NULL,
  `Account_parentId` INT NOT NULL,
  INDEX `studentId_idx` (`Student_studentId` ASC) VISIBLE,
  INDEX `parentId_idx` (`Account_parentId` ASC) VISIBLE,
  CONSTRAINT `studentId1`
    FOREIGN KEY (`Student_studentId`)
    REFERENCES `schooldb1`.`Students` (`studentId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `parentId`
    FOREIGN KEY (`Account_parentId`)
    REFERENCES `schooldb1`.`Accounts` (`accountId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE TABLE `schooldb1`.`Student_has_Class` (
  `Student_studentId` INT NOT NULL,
  `Class_classId` INT NOT NULL,
  INDEX `studentId_idx` (`Student_studentId` ASC) VISIBLE,
  INDEX `classId_idx` (`Class_classId` ASC) VISIBLE,
  CONSTRAINT `studentId2`
    FOREIGN KEY (`Student_studentId`)
    REFERENCES `schooldb1`.`Students` (`studentId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `classId1`
    FOREIGN KEY (`Class_classId`)
    REFERENCES `schooldb1`.`Class` (`classId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE TABLE `schooldb1`.`Teacher_has_Class` (
  `Account_teacherId` INT NOT NULL,
  `Class_classId` INT NOT NULL,
  INDEX `teacherId_idx` (`Account_teacherId` ASC) VISIBLE,
  INDEX `classId2_idx` (`Class_classId` ASC) VISIBLE,
  CONSTRAINT `teacherId`
    FOREIGN KEY (`Account_teacherId`)
    REFERENCES `schooldb1`.`Accounts` (`accountId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `classId2`
    FOREIGN KEY (`Class_classId`)
    REFERENCES `schooldb1`.`Class` (`classId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

INSERT INTO schooldb1.Accounts(creationDate, email, password, firstName, lastName, type, school)
VALUES
	('241120', 'billy.benson@tdsb.ca', 'bb', 'Billy', 'Benson', 'Secretary', 'York');



INSERT INTO schooldb1.Class(name, school)
VALUES
	('MATH2930', 'York'),
    ('ENG1000', 'York'),
    ('EECS4312', 'Ryerson'),
    ('ENG4000', 'Ryerson');

INSERT INTO schooldb1.Students(firstName, lastName)
VALUES
	('William', 'Zeeker'),
    ('James', 'Turner'),
    ('Stephen', 'Zeeker'),
    ('Tiffany', 'Turner'),
    ('Samantha', 'Lioner'),
    ('Robert', 'Smith'),
    ('Jimmy', 'Riptone'),
    ('Timmothy', 'Yonks');

INSERT INTO schooldb1.Accounts(creationDate, email, password, firstName, lastName, type, school)
VALUES
	('11/29/2020', 'emily.clam@tdsb.ca', 'kittens446', 'Emily', 'Clam', 'Secretary', 'Rockdale Secondary School'),
    ('11/29/2020', 'sally.temir@tdsb.ca', 'cats154', 'Sally', 'Temir', 'Teacher', 'Rockdale Secondary School'),
    ('11/29/2020', 'john.fredine@tdsb.ca', 'tiger456', 'John', 'Fredine', 'Teacher', 'Rockdale Secondary School'),
    ('11/29/2020', 'ron.weasle@tdsb.ca', 'willy785', 'Ron', 'Weasle', 'Teacher', 'Rockdale Secondary School'),
    ('11/29/2020', 'paul.redlock@tdsb.ca', 'turnipspin2', 'Paul', 'Redlock', 'Teacher', 'Rockdale Secondary School');

INSERT INTO schooldb1.Accounts(creationDate, email, password, firstName, lastName, type, school)
VALUES
	('11/29/2020', 'benard.pearle@tdsb.ca', 'triangle737', 'Benard', 'Pearle', 'Secretary', 'Fintank Secondary School'),
    ('11/29/2020', 'karen.treat@tdsb.ca', 'zipperlurk4', 'Karen', 'Treat', 'Teacher', 'Fintank Secondary School'),
    ('11/29/2020', 'samira.piatso@tdsb.ca', 'redpurpl1e', 'Samira', 'Piatso', 'Teacher', 'Fintank Secondary School'),
    ('11/29/2020', 'lenard.minty@tdsb.ca', 'orangegre3n', 'Lenard', 'Minty', 'Teacher', 'Fintank Secondary School'),
    ('11/29/2020', 'christopher.links@tdsb.ca', 'zedxprq', 'Christopher', 'Links', 'Teacher', 'Fintank Secondary School'),
    ('11/29/2020', 'mark.zeeker@gmail.com', 'beans303', 'Mark', 'Zeeker', 'Parent', ''),
    ('11/29/2020', 'trisha.turner@gmail.com', 'serpentine23', 'Trisha', 'Turner', 'Parent', ''),
    ('11/29/2020', 'maeve.lioner@gmail.com', 'nine9nine', 'Maeve', 'Lioner', 'Parent', ''),
    ('11/29/2020', 'william.smith@gmail.com', 'rainbowshine99', 'William', 'Smith', 'Parent', '')
    ('11/29/2020', 'jeffrey.riptone@gmail.com', 'seven8nine', 'Jeffrey', 'Riptone', 'Parent', ''),
    ('11/29/2020', 'lenard.yonks@gmail.com', 'zenatten', 'Lenard', 'Yonks', 'Parent', '');

INSERT INTO schooldb1.Class(className, school, Time)
VALUES
	('MATH1U0', 'Fintank Secondary School', '9:00'),
  ('MATH1U0', 'Rockdale Secondary School', '9:00'),
  ('MATH2U0', 'Fintank Secondary School', '9:00'),
  ('MATH2U0', 'Rockdale Secondary School', '9:00'),
  ('MATH3U0', 'Fintank Secondary School', '9:00'),
  ('MATH3U0', 'Rockdale Secondary School', '9:00'),
  ('MATH4U0', 'Fintank Secondary School', '9:00'),
  ('MATH4U0', 'Rockdale Secondary School', '9:00'),
	('ENG1U0', 'Fintank Secondary School', '11:00'),
  ('ENG1U0', 'Rockdale Secondary School', '11:00'),
  ('ENG2U0', 'Fintank Secondary School', '11:00'),
  ('ENG2U0', 'Rockdale Secondary School', '11:00'),
  ('ENG3U0', 'Fintank Secondary School', '11:00'),
  ('ENG3U0', 'Rockdale Secondary School', '11:00'),
  ('ENG4U0', 'Fintank Secondary School', '11:00'),
  ('ENG4U0', 'Rockdale Secondary School', '11:00'),
  ('SCI1U0', 'Fintank Secondary School', '13:00'),
  ('SCI1U0', 'Rockdale Secondary School', '13:00'),
  ('SCI2U0', 'Fintank Secondary School', '13:00'),
  ('SCI2U0', 'Rockdale Secondary School', '13:00'),
  ('SCI3U0', 'Fintank Secondary School', '13:00'),
  ('SCI3U0', 'Rockdale Secondary School', '13:00'),
  ('SCI4U0', 'Fintank Secondary School', '13:00'),
  ('SCI4U0', 'Rockdale Secondary School', '13:00'),
  ('BUS1U0', 'Fintank Secondary School', '15:00'),
  ('BUS1U0', 'Rockdale Secondary School', '15:00'),
  ('BUS2U0', 'Fintank Secondary School', '15:00'),
  ('BUS2U0', 'Rockdale Secondary School', '15:00'),
  ('BUS3U0', 'Fintank Secondary School', '15:00'),
  ('BUS3U0', 'Rockdale Secondary School', '15:00'),
  ('BUS4U0', 'Fintank Secondary School', '15:00'),
  ('BUS4U0', 'Rockdale Secondary School', '15:00')
  ;

  INSERT INTO schooldb1.Student_has_Class(Student_studentId, Class_classId)
  VALUES
    (11, 27),
    (11, 35),
    (11, 43),
    (11, 51),
    (12, 28),
    (12, 36),
    (12, 44),
    (12, 52),
    (13, 29),
    (13, 37),
    (13, 45),
    (13, 53),
    (14, 30),
    (14, 38),
    (14, 46),
    (14, 54),
    (15, 31),
    (15, 39),
    (15, 47),
    (15, 55),
    (16, 32),
    (16, 40),
    (16, 48),
    (16, 56),
    (17, 33),
    (17, 41),
    (17, 49),
    (17, 57),
    (18, 34),
    (18, 42),
    (18, 50),
    (18, 58)
    ;

  INSERT INTO schooldb1.Teacher_has_Class(Account_teacherId, Class_classId)
  VALUES
    (22, 28),
    (22, 36),
    (22, 44),
    (22, 52),
    (23, 30),
    (23, 38),
    (23, 46),
    (23, 54),
    (24, 32),
    (24, 40),
    (24, 48),
    (24, 56),
    (29, 34),
    (29, 42),
    (29, 50),
    (29, 58),
    (26, 27),
    (26, 35),
    (26, 43),
    (26, 51),
    (27, 29),
    (27, 37),
    (27, 45),
    (27, 53),
    (28, 31),
    (28, 39),
    (28, 47),
    (28, 55),
    (30, 33),
    (30, 41),
    (30, 49),
    (30, 57)
    ;

  INSERT INTO schooldb1.Student_has_Parent(Student_studentId, Account_parentId)
  VALUES
    (11, 31),
    (12, 32),
    (13, 31),
    (14, 32),
    (15, 33),
    (16, 34),
    (17, 35),
    (18, 36)
    ;

INSERT INTO schooldb1.Attendance(date, Student_studentId, Class_classId, status, verified, notified)
VALUES
  ('11/30/2020', 11, 27, 'Present', 0, 0),
  ('11/30/2020', 11, 35, 'Present', 0, 0),
  ('11/30/2020', 11, 43, 'Present', 0, 0),
  ('11/30/2020', 11, 51, 'Present', 0, 0),

  ('11/30/2020', 12, 28, 'Present', 0, 0),
  ('11/30/2020', 12, 36, 'Present', 0, 0),
  ('11/30/2020', 12, 44, 'Present', 0, 0),
  ('11/30/2020', 12, 52, 'Present', 0, 0),

  ('11/30/2020', 13, 29, 'Present', 0, 0),
  ('11/30/2020', 13, 37, 'Present', 0, 0),
  ('11/30/2020', 13, 45, 'Present', 0, 0),
  ('11/30/2020', 13, 53, 'Present', 0, 0),

  ('11/30/2020', 14, 30, 'Present', 0, 0),
  ('11/30/2020', 14, 38, 'Present', 0, 0),
  ('11/30/2020', 14, 46, 'Present', 0, 0),
  ('11/30/2020', 14, 54, 'Present', 0, 0),

  ('11/30/2020', 15, 31, 'Present', 0, 0),
  ('11/30/2020', 15, 39, 'Present', 0, 0),
  ('11/30/2020', 15, 47, 'Present', 0, 0),
  ('11/30/2020', 15, 55, 'Present', 0, 0),

  ('11/30/2020', 16, 32, 'Present', 0, 0),
  ('11/30/2020', 16, 40, 'Present', 0, 0),
  ('11/30/2020', 16, 48, 'Present', 0, 0),
  ('11/30/2020', 16, 56, 'Present', 0, 0),

  ('11/30/2020', 17, 33, 'Present', 0, 0),
  ('11/30/2020', 17, 41, 'Present', 0, 0),
  ('11/30/2020', 17, 49, 'Present', 0, 0),
  ('11/30/2020', 17, 57, 'Present', 0, 0),

  ('11/30/2020', 18, 34, 'Present', 0, 0),
  ('11/30/2020', 18, 42, 'Present', 0, 0),
  ('11/30/2020', 18, 50, 'Present', 0, 0),
  ('11/30/2020', 18, 58, 'Present', 0, 0)
  ;



INSERT INTO schooldb1.Students(firstName, lastName)
VALUES
	('Charley', 'Crosby'),
    ('Charlene', 'Winters'),
    ('Jez', 'Montes'),
    ('Joni', 'Ewing'),
    ('Niall', 'Bloggs'),
    ('Philippa', 'Manning'),
    ('Fleur', 'Salgado'),
    ('Darla', 'Hamilton'),
    ('Emaan', 'Frye'),
    ('Cynthia', 'Gunn'),
    ('Javier', 'Ingram'),
    ('Theon', 'Rangel'),
    ('Shiv', 'Vinson'),
    ('Edmund', 'Dyer'),
    ('Geraint', 'Guzman'),
    ('Koby', 'Bowes'),
    ('Jared', 'Hackett'),
    ('Aneesha', 'Luna'),
    ('Nazia', 'Mcarthur'),
    ;

INSERT INTO schooldb1.Accounts(creationDate, email, password, firstName, lastName, type, school)
VALUES
    ('29/11/2020', 'tim.crosby@gmail.com', 'abc2321', 'Tim', 'Crosby', 'Parent', ''),
    ('29/11/2020', 'tina.winters@gmail.com', 'psdoHJKS323', 'Tina', 'Winters', 'Parent', ''),
    ('29/11/2020', 'marry.montes@gmail.com', 'purplepower2', 'Marry', 'Montes', 'Parent', ''),
    ('29/11/2020', 'yasemin.ewing@gmail.com', 'railing29', 'Yasemin', 'Ewing', 'Parent', ''),
    ('29/11/2020', 'ashlea.bloggs@gmail.com', 'elephant245', 'Ashlea', 'Bloggs', 'Parent', ''),
    ('29/11/2020', 'harlow.manning@gmail.com', 'zsoap446', 'Harlow', 'Manning', 'Parent', ''),
    ('29/11/2020', 'elodie.salgado@gmail.com', 'blackcar29', 'Elodie', 'Salgado', 'Parent', ''),
    ('29/11/2020', 'shae.Hamilton@gmail.com', 'apple2039', 'Shae', 'Hamilton', 'Parent', ''),
    ('29/11/2020', 'mollie.frye@gmail.com', 'seven119', 'Mollie', 'Frye', 'Parent', ''),
    ('29/11/2020', 'anees.gunn@gmail.com', 'maybe2399', 'Anees', 'Gunn', 'Parent', ''),
    ('29/11/2020', 'veer.ingram@gmail.com', '77disco', 'Veer', 'Ingram', 'Parent', ''),
    ('29/11/2020', 'marwah.rangel@gmail.com', 'dogsarecute', 'Marwah', 'Rangel', 'Parent', ''),
    ('29/11/2020', 'fynn.vinson@gmail.com', 'cats4life', 'Fynn', 'Vinson', 'Parent', ''),
    ('29/11/2020', 'brax.dyer@gmail.com', 'snakemaker2', 'Brax', 'Dyer', 'Parent', ''),
    ('29/11/2020', 'findlay.guzman@gmail.com', 'proper60', 'Findlay', 'Guzman', 'Parent', ''),
    ('29/11/2020', 'tai.bowes@gmail.com', 'rfcool0009', 'Tai', 'Bowes', 'Parent', ''),
    ('29/11/2020', 'bobbi.hackett@gmail.com', 'maskon19', 'Bobbi', 'Hackett', 'Parent', ''),
    ('29/11/2020', 'alexa.luna@gmail.com', 'treeflag89', 'Alexa', 'Luna', 'Parent', ''),
    ('29/11/2020', 'kirsten.mcarthur@gmail.com', 'cloudsmell50234', 'Kirsten', 'Mcarthur', 'Parent', '');

INSERT INTO schooldb1.Student_has_Parent(Student_studentId, Account_parentId)
VALUES
    (19, 37),
    (20, 38),
    (21, 39),
    (22, 40),
    (23, 41),
    (24, 42),
    (25, 43),
    (26, 44),
    (27, 45),
    (28, 46),
    (29, 47),
    (30, 48),
    (31, 49),
    (32, 50),
    (33, 51),
    (34, 52),
    (35, 53),
    (36, 54),
    (37, 55)
    ;

INSERT INTO schooldb1.Student_has_Class(Student_studentId, Class_classId)
VALUES
    (19, 29),
    (19, 37),
    (19, 45),
    (19, 53),

    (20, 29),
    (20, 37),
    (20, 45),
    (20, 53),

    (21, 29),
    (21, 37),
    (21, 45),
    (13, 53),

    (22, 29),
    (22, 37),
    (22, 45),
    (22, 53),

    (23, 29),
    (23, 37),
    (23, 45),
    (23, 53),

    (24, 29),
    (24, 37),
    (24, 45),
    (24, 53),

    (25, 29),
    (25, 37),
    (25, 45),
    (25, 53),

    (26, 29),
    (26, 37),
    (26, 45),
    (26, 53),

    (27, 29),
    (27, 37),
    (27, 45),
    (27, 53),

    (28, 29),
    (28, 37),
    (28, 45),
    (28, 53),

    (29, 29),
    (29, 37),
    (29, 45),
    (29, 53),

    (30, 29),
    (30, 37),
    (30, 45),
    (30, 53),

    (31, 29),
    (31, 37),
    (31, 45),
    (31, 53),

    (32, 29),
    (32, 37),
    (32, 45),
    (32, 53),

    (33, 29),
    (33, 37),
    (33, 45),
    (33, 53),

    (34, 29),
    (34, 37),
    (34, 45),
    (34, 53),

    (35, 29),
    (35, 37),
    (35, 45),
    (35, 53),

    (36, 29),
    (36, 37),
    (36, 45),
    (36, 53),

    (37, 29),
    (37, 37),
    (37, 45),
    (37, 53)
    ;