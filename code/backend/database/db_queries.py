from datetime import date
import datetime
import mysql.connector
import database.db_credentials as db
from mysql.connector import errorcode

params = {
    'user': db.USERNAME,
    'password': db.PASSWORD,
    'host': db.HOST,
    'database': db.DB_NAME,
    'port': db.PORT
}

# Overhead for generating cursors is very low
# Overhead for generating connections is what's causing issues
class DbWrapper:
    def __init__(self):
        self.connector = mysql.connector.connect(**params)

    def close(self):
        self.connector.close()

    def runQuery(self, query, *args):
        rowList = []
        try:
            # db_connector = mysql.connector.connect(**params)
            db_connector = self.connector
            cur = db_connector.cursor(dictionary=True)
            cur.execute(query, args)
            row = cur.fetchone()

            while row is not None:
                rowList.append(row)
                row = cur.fetchone()

        except Exception as e:
            print('Error running query {}:\n{}'.format(query, e))
        
        finally:
            cur.close()
        
        return rowList

    def runCommand(self, command, *args):
        try:
            db_connector = self.connector
            cur = db_connector.cursor(dictionary=True)

            cur.executemany(command, [args])

            db_connector.commit()
        except Exception as e:
            print('Error running command {}:\n{}'.format(command, e))
        
        finally:
            cur.close()

    def getTeacherClasses(self, email):
        query_str = "SELECT className FROM schooldb1.Teacher_has_Class \
            INNER JOIN Accounts on Accounts.accountId = Teacher_has_Class.Account_teacherId \
            INNER JOIN Class ON Class.classId = Teacher_has_Class.Class_classId \
            WHERE email=%s"

        classes = self.runQuery(query_str, email)
        return classes
    
    def addParent(self, name, email, password, personType):
        today = date.today()
        today = today.strftime("%d/%m/%Y")
        firstName = name.split(" ")[0]
        lastName = name.split(" ")[1]
        command = "INSERT INTO schooldb1.Accounts (creationDate, email, password, firstName, lastName, type) VALUES (%s, %s, %s, %s, %s, %s);"
        try:
            self.runCommand(command, today, email, password, firstName, lastName, personType)
            return True
        except Exception as e:
            print("ERROR - {}".format(e))
            return False

    def addTeacher(self, name, email, password, personType, schoolName):
        today = date.today()
        today = today.strftime("%d/%m/%Y")
        firstName = name.split(" ")[0]
        lastName = name.split(" ")[1]
        command = "INSERT INTO schooldb1.Accounts (creationDate, email, password, firstName, lastName, type, school) VALUES (%s, %s, %s, %s, %s, %s, %s);"
        try:
            self.runCommand(command, today, email, password, firstName, lastName, personType, schoolName)
            return True
        except Exception as e:
            print("ERROR - {}".format(e))
            return False

    def setTeacherClasses(self, name, classList, schoolName):
        firstName = name.split(" ")[0]
        lastName = name.split(" ")[1]
        teacherId = self.account_id_from_name(firstName, lastName)

        for c in classList:
            classId = self.class_id_from_name(c)
            if classId == "":
                print("ERROR - COULD NOT FIND CLASS ID={}".format(classId))
                return False

            command = "INSERT INTO schooldb1.Teacher_has_Class (Account_teacherId, Class_classId) VALUES (%s, %s)"

            class_command = "UPDATE Accounts SET school =%s WHERE firstName=%s AND lastName=%s" 

            try:
                self.runCommand(command,teacherId,classId)
                self.runCommand(class_command, schoolName, firstName, lastName)
            except Exception as e:
                print("Error - {}".format(e))
                return False
        return True

    def accountExists(self, email):
        query = self.runQuery("Select * FROM schooldb1.Accounts Where email=%s", email)
        if len(query) == 0:
            return False
        return True

    def student_id_from_name(self, firstName, lastName):
        studentId = self.runQuery("SELECT studentId FROM Students WHERE firstName=%s AND lastName=%s", firstName, lastName)
        if len(studentId) < 1 or not 'studentId' in studentId[0]:
            return ""
        
        return studentId[0]['studentId']

    def account_id_from_name(self, firstName, lastName):
        accountId = self.runQuery("SELECT accountId FROM Accounts WHERE firstName=%s AND lastName=%s", firstName, lastName)
        if len(accountId) < 1 or not 'accountId' in accountId[0]:
            return ""
        
        return accountId[0]['accountId']

    def class_id_from_name(self, className):
        classId = self.runQuery("SELECT classId FROM Class WHERE className=%s", className)
        if len(classId) < 1 or not 'classId' in classId[0]:
            return ""
        
        return classId[0]['classId']

    def getStudentRecords(self, studentName, date, className):
        # Get School Name
        query_str = "SELECT school from ((Attendance INNER JOIN Class ON Attendance.Class_classId = Class.classId) \
            INNER JOIN Students ON Attendance.Student_studentId = Students.studentId) \
            WHERE firstName=%s AND lastName=%s"
        schoolName=self.runQuery(query_str, studentName.split(' ')[0], studentName.split(' ')[1])

        # return nothing if there's no valid schoolname
        if len(schoolName) < 1 or not 'school' in schoolName[0]:
            return []

        schoolName = schoolName[0]['school']

        # Get records from all time, filtered by school
        # In this call, date='' and className can optionally be =''
        attendanceList = self.getAttendanceList(schoolName, studentName, className, '')
        
        # Filter for current month
        studentRecord = []
        for a in attendanceList:
            if a['Date'].split('/')[1] == date.split('/')[1]:
                record= {
                    "Name":a['Name'],
                    "Attendance":a['Attendance'],
                    "Class":a['Class'],
                    "Date":a['Date']
                }
                studentRecord.append(record)

        return studentRecord

    def getpassword(self, email):
        query = self.runQuery("SELECT password from Accounts WHERE email=%s", email)
        if len(query) == 0:
            return ""
        return query[0]['password']

    def getpersonType(self, email):
        query = self.runQuery("SELECT type from Accounts WHERE email=%s", email)
        if len(query) == 0:
            return "None"
        return query[0]['type']

    def getSchoolName(self, email):
        query = self.runQuery("SELECT school from Accounts WHERE email=%s", email)
        return query[0]['school']

    def getListOfClasses(self, schoolName):
        if schoolName == "" or schoolName == None:
            return []

        qlist = []
        query = self.runQuery("SELECT className from Class WHERE school=%s", schoolName)

        for q in query:
            qlist.append(q['className'])
            
        return qlist

    def getAttendanceList(self, schoolName, studentName, className, date):
        qlist = []
        # Get ALL attendance records for the school
        query_str = 'SELECT * from ((Attendance INNER JOIN Class ON Attendance.Class_classId = Class.classId) INNER JOIN Students ON Attendance.Student_studentId = Students.studentId)'
        query_str += ' WHERE school="' + str(schoolName) + '"'
        
        # Filter by Student Name 
        if (studentName != ''):
            if ' ' in studentName:
                query_str += ' AND firstName="' + studentName.split(' ')[0] + '" AND lastName="' + studentName.split(' ')[1] + '"'
            else:
                query_str += ' AND firstName="' + studentName.split(' ')[0] + '"'

        # Filter by Class Name
        if (className != ''):
            query_str += ' AND className="' + className + '"'
        
        # Filter by Date
        if (date != ''):
            query_str += ' AND date="' + date + '"'

        query = self.runQuery(query_str)
        for q in query:
            record = {}
            record['Name'] = q['firstName'] + ' ' + q['lastName']
            record['Attendance'] = q['status']
            record['Class'] = q['className']
            record['Date'] = q['date']
            record['Reason For Absence'] = q['reason']
            record['Reason Verified'] = q['verified']
            if (q['notified'] == True):
                record['Parent Notified'] = 'Y'
            else:
                record['Parent Notified'] = 'N'
            qlist.append(record)
        
        return qlist

    def notifyParents(self, firstName, lastName, date, className):
        # First get the student ID given the info
        studentId = self.getStudentId(firstName, lastName)

        self.runCommand("UPDATE Attendance \
            INNER JOIN Class ON Attendance.Class_classId = Class.classId \
            SET notified = '1' \
            WHERE Student_studentId=%s AND date=%s AND className=%s", studentId, date, className)
        return True

    def updateAttendanceRecord(self, firstName, lastName, attendance, className,
        date, reason, verified, parentNotified):
        studentId = self.getStudentId(firstName, lastName)

        if studentId == "":
            return False

        self.runCommand("UPDATE Attendance \
        INNER JOIN Class ON Attendance.Class_classId = Class.classId \
        SET status = %s, reason = %s, verified = %s, notified=%s\
        WHERE Student_studentId=%s AND date=%s AND className=%s", 
        attendance, reason, verified, parentNotified, 
        studentId, date, className)

        return True

    def setParentChildren(self, parentName, childList):
        firstName = parentName.split(" ")[0]
        lastName = parentName.split(" ")[1]
        parentId = self.account_id_from_name(firstName, lastName)

        for child in childList:
            childFirst = child.split(" ")[0]
            childLast = child.split(" ")[1]
            childId = self.student_id_from_name(childFirst, childLast)
            if childId == "":
                print("ERROR - COULD NOT FIND CHILD ID={}".format(childId))
                return False

            command = "INSERT INTO schooldb1.Student_has_Parent (Student_studentId, Account_parentId) VALUES (%s, %s);"
            try:
                self.runCommand(command,childId, parentId)
            except Exception as e:
                print("Error - {}".format(e))
                return False   
        return True

    # def accountExists(email):
    #     """
    #     return true if email already exists in db
    #     """
    #     query = self.runQuery("Select * FROM schooldb1.Accounts Where email=%s", email)
    #     if len(query) == 0:
    #         return False
    #     return True

    def removePerson(self, name):
        firstName = name.split(" ")[0]
        lastName = name.split(" ")[1]

        command = "DELETE FROM schooldb1.Accounts WHERE firstName=%s AND lastName=%s"
        try:
            self.runCommand(command,firstName, lastName)
        except Exception as e:
            print("Error - {}".format(e))
            return False   
        return True

    def getAttendanceStatus(self, className, date):
        query_str = 'SELECT COUNT(*) FROM schooldb1.Attendance INNER JOIN Class ON Attendance.Class_classId = Class.classId'
        query_str += ' WHERE className="' + className + '" AND date="' + date + '"'
        query_count = self.runQuery(query_str)[0]['COUNT(*)']
        
        if (query_count > 0):
            return True

        return False

    def getChildren(self, email):
        qlist = []

        query_str = 'SELECT Students.firstName, Students.lastName, email, Class.school from Students \
                    INNER JOIN Student_has_Class ON Students.studentId = Student_has_Class.Student_studentId \
                    INNER JOIN Class ON Student_has_Class.Class_classId = Class.classId \
                    INNER JOIN Student_has_Parent ON Students.studentId = Student_has_Parent.Student_studentId \
                    INNER JOIN Accounts ON Accounts.accountId = Student_has_Parent.Account_parentId \
                    WHERE Class.time = "9:00" AND email="' + email + '"'

        query = self.runQuery(query_str)

        for q in query:
            record = {}
            record['Name'] = q['firstName'] + ' ' + q['lastName']
            record['School'] = q['school']
            record['Attendance'] = 'Present'
            qlist.append(record)
        
        return qlist

    def getChildStatusesToday(self, firstName, lastName, date):
        qList = []
        query_str = 'SELECT status from Attendance \
                    INNER JOIN Class ON Attendance.Class_classId = Class.classId \
                    INNER JOIN Students ON Attendance.Student_studentId = Students.studentId \
                    WHERE firstName="' + firstName + '" AND lastName="' + lastName + '" AND date="' + date + '"' 
        query = self.runQuery(query_str)

        for q in query:
            qList.append(q['status'])

        return qList

    def getClassTime(self, className, schoolName):
        query_str = 'SELECT time FROM Class WHERE className="' + className + '" AND school="' + schoolName +'"'
        time = self.runQuery(query_str)[0]['time']
        return time

    def getClassStudentList(self, className, schoolName):
        # Gets all students in a given class (empty records)
        qList = []
        query_str = 'SELECT firstName, lastName FROM Student_has_Class \
                    INNER JOIN Class ON Student_has_Class.Class_classId = Class.classId \
                    INNER JOIN Students ON Student_has_Class.Student_studentId = Students.studentId \
                    WHERE className="' + className + '" AND school="' + schoolName +'"'
        
        query = self.runQuery(query_str)
        for q in query:
            record = {}
            record['Name'] = q['firstName'] + ' ' + q['lastName']
            record['Attendance'] = ''
            qList.append(record)
        
        return qList

    def getExistingClassRecords(self, className, schoolName, date):
        # Gets all students in a class who have existing records
        qList = []
        query_str = 'SELECT firstName, lastName, status FROM Attendance \
                    INNER JOIN Class ON Attendance.Class_classId = Class.classId \
                    INNER JOIN Students ON Attendance.Student_studentId = Students.studentId \
                    WHERE className="' + className + '" AND school="' + schoolName + '" AND date="' + date +'"'
        
        query = self.runQuery(query_str)
        for q in query:
            record = {}
            record['Name'] = q['firstName'] + ' ' + q['lastName']
            record['Attendance'] = q['status']
            qList.append(record)
        
        return qList

    def getChildClasses(self, firstName, lastName):
        qList = []
        query_str = 'SELECT className, time FROM Student_has_Class \
                    INNER JOIN Class ON Student_has_Class.Class_classId = Class.classId \
                    INNER JOIN Students ON Student_has_Class.Student_studentId = Students.studentId \
                    WHERE firstName="' + firstName + '"'
        if (lastName != ''):
            query_str += ' AND lastName="' + lastName + '"'
        
        query = self.runQuery(query_str)

        for q in query:
            record = {}
            record['className'] = q['className']
            record['classHour'] = q['time'].split(':')[0]
            qList.append(record)

        return qList

    def getAttedanceRecords(self, name):
        qList = []
        firstName = name.split(" ")[0]
        lastName = name.split(" ")[1]
        studentId = self.getStudentId(firstName, lastName)
        today = date.today().strftime("%d/%m/%Y")

        query_str = 'SELECT * FROM schooldb1.Attendance INNER JOIN schooldb1.Class \
                    ON schooldb1.Attendance.Class_classId = schooldb1.Class.classId \
                    WHERE date= "' + today + '" AND Student_studentId= "' + str(studentId) +'" \
                    AND Attendance.status <> "Present" \
                    AND Attendance.verified = "0"'
        query = self.runQuery(query_str)

        for q in query:
            record = {}
            record['className'] = q['className']
            record['attendance'] = q['status']
            qList.append(record)

        return qList

    def reportChild(self, name, className, date, attendance, reason):
        firstName = name.split(" ")[0]
        lastName = name.split(" ")[1]
        studentId = self.getStudentId(firstName, lastName)

        # check to see if row already in attendence table. 
        # If yes just update, if no then insert row
        query_str = 'SELECT * FROM schooldb1.Attendance INNER JOIN schooldb1.Class \
                ON schooldb1.Attendance.Class_classId = schooldb1.Class.classId \
                WHERE Student_studentId = "' + str(studentId) + '" and className = "' + str(className) + '" and date = "' + date +'"'
        queryResult = self.runQuery(query_str)
        if len(queryResult) == 1:
            self.runCommand("UPDATE schooldb1.Attendance INNER JOIN schooldb1.Class \
                ON schooldb1.Attendance.Class_classId = schooldb1.Class.classId \
                SET status = %s, reason = %s WHERE Student_studentId=%s AND date=%s AND className=%s", 
                attendance, reason, str(studentId), date, className)
        else:
            query_str = 'SELECT * FROM schooldb1.Class INNER JOIN schooldb1.Student_has_Class \
                ON schooldb1.Class.classId = schooldb1.Student_has_Class.Class_classId \
                WHERE className = "' + str(className) + '" and Student_studentId = "' + str(studentId) +'"'
            query = self.runQuery(query_str)
            classId = query[0]["classId"]
            command = "INSERT INTO schooldb1.Attendance (date, Class_classId, Student_studentId, status, reason) VALUES (%s, %s, %s, %s, %s);"
            self.runCommand(command, date, classId, str(studentId), attendance, reason)
        
        return True

    def getTeacherHistoricalAttendance(self, schoolName, studentName, date, classList):
        qlist = []
        # Get ALL attendance records for the school
        query_str = 'SELECT * from ((Attendance INNER JOIN Class ON Attendance.Class_classId = Class.classId) \
                    INNER JOIN Students ON Attendance.Student_studentId = Students.studentId)'
        query_str += ' WHERE school="' + str(schoolName) + '"'
        
        # Filter by Student Name 
        if (studentName != ''):
            if ' ' in studentName:
                query_str += ' AND firstName="' + studentName.split(' ')[0] + '" AND lastName="' + studentName.split(' ')[1] + '"'
            else:
                query_str += ' AND firstName="' + studentName.split(' ')[0] + '"'
        
        # Filter by Date
        if (date != ''):
            query_str += ' AND date="' + date + '"'

        # Filter by Teacher Classes
        if len(classList) == 1:
            query_str += ' AND className="' + classList[0] + '"'
        elif len(classList) > 1:
            query_str += ' AND (className="' + classList[0] + '"'
            for i in range(1,len(classList)):
                query_str += ' OR className="' + classList[i] + '"'
            query_str += ')'

        query = self.runQuery(query_str)

        for q in query:
            record = {}
            record['Name'] = q['firstName'] + ' ' + q['lastName']
            record['Attendance'] = q['status']
            record['Class'] = q['className']
            record['Date'] = q['date']
            qlist.append(record)
        
        return qlist

    def addRecord(self, className, firstName, lastName, attendance, schoolName):
        now = datetime.datetime.now().timestamp()
        today = datetime.datetime.fromtimestamp(now).strftime('%d/%m/%Y')
        studentId = self.getStudentId(firstName, lastName)
        command_check  = 'SELECT * FROM schooldb1.Attendance INNER JOIN schooldb1.Class \
            ON schooldb1.Attendance.Class_classId = schooldb1.Class.classId \
            WHERE Student_studentId = "' + str(studentId) + '" AND className = "' + className + \
            '" AND date = "' + today + '" AND school = "' + schoolName + '"'
        query = self.runQuery(command_check)
        if len(query) == 0:
            command = 'INSERT INTO schooldb1.Attendance (date, Class_classId, Student_studentId, status) \
            VALUES (%s, %s, %s, %s);'
            class_query = 'SELECT classId FROM Class WHERE className="' + className + '" AND school="' + schoolName + '"'
            classId = self.runQuery(class_query)[0]['classId']
            self.runCommand(command, today, classId, studentId, attendance)
            return True
        return False

    def getStudentId(self, firstName, lastName):
        query = self.runQuery("SELECT studentId FROM schooldb1.Students WHERE firstName = %s and lastName = %s", firstName, lastName)
        return query[0]["studentId"]

    def recordExists(self, firstName, lastName, recordType, schoolName):
        if (recordType == 'Student'):
            # Search for student record
            query_str = 'SELECT firstName FROM schooldb1.Students \
                        INNER JOIN Student_has_Class ON Students.studentId = Student_has_Class.Student_studentId \
                        INNER JOIN Class ON Student_has_Class.Class_classId = Class.classId \
                        WHERE firstName = "' + firstName + '" AND lastName = "' + lastName + \
                        '" AND school = "' + schoolName + '"'
        else:
            # Search for parent/teacher record
            query_str = 'SELECT firstName FROM schooldb1.Accounts WHERE firstName = "' + \
                        firstName + '" AND lastName = "' + lastName
            if (recordType == "Parent"):
                query_str += '" AND type="' + recordType + '"'
            else:
                query_str += '" AND school = "' + schoolName + '"'
            
        query = self.runQuery(query_str)
        if len(query) > 0:
            return True
        else:
            return False



