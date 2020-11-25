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

CREATE TABLE `schooldb1`.`Attendance` (
  `attendanceId` INT NOT NULL AUTO_INCREMENT,
  `date` VARCHAR(45) NOT NULL,
  `Class_classId` INT NOT NULL,
  `Student_studentId` INT NOT NULL,
  `present` TINYINT NOT NULL,
  `reason` VARCHAR(45) NULL,
  PRIMARY KEY (`attendanceId`),
  INDEX `studentId_idx` (`Student_studentId` ASC) VISIBLE,
  INDEX `classId_idx` (`Class_classId` ASC) VISIBLE,
  CONSTRAINT `classId`
    FOREIGN KEY (`Class_classId`)
    REFERENCES `schooldb1`.`Class` (`classId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `studentId`
    FOREIGN KEY (`Student_studentId`)
    REFERENCES `schooldb1`.`Students` (`studentId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

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