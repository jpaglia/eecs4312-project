import database.db_ops as db_ops
from datetime import date

def student_id_from_name(firstName, lastName):
    studentId = db_ops.runQuery("SELECT studentId FROM Students WHERE firstName=%s AND lastName=%s", firstName, lastName)
    if len(studentId) < 1 or not 'studentId' in studentId[0]:
        return ""
    
    return studentId[0]['studentId']

def getTeacherClasses(email):
    query_str = "SELECT className FROM schooldb1.Teacher_has_Class \
        INNER JOIN Accounts on Accounts.accountId = Teacher_has_Class.Account_teacherId \
        INNER JOIN Class ON Class.classId = Teacher_has_Class.Class_classId \
        WHERE email=%s"

    classes = db_ops.runQuery(query_str, email)
    return classes

def getStudentRecords(studentName, date, className):
    # Get School Name
    query_str = "SELECT school from ((Attendance INNER JOIN Class ON Attendance.Class_classId = Class.classId) \
        INNER JOIN Students ON Attendance.Student_studentId = Students.studentId) \
        WHERE firstName=%s AND lastName=%s"
    schoolName=db_ops.runQuery(query_str, studentName.split(' ')[0], studentName.split(' ')[1])

    # return nothing if there's no valid schoolname
    if len(schoolName) < 1 or not 'school' in schoolName[0]:
        return []

    schoolName = schoolName[0]['school']

    # Get records from all time, filtered by school
    # In this call, date='' and className can optionally be =''
    attendanceList = getAttendanceList(schoolName, studentName, className, '')
    
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

def getpassword(email):
    query = db_ops.runQuery("SELECT password from Accounts WHERE email=%s", email)
    if len(query) == 0:
        return ""
    return query[0]['password']

def getpersonType(email):
    query = db_ops.runQuery("SELECT type from Accounts WHERE email=%s", email)
    if len(query) == 0:
        return "None"
    return query[0]['type']

def getSchoolName(email):
    query = db_ops.runQuery("SELECT school from Accounts WHERE email=%s", email)
    return query[0]['school']

def getListOfClasses(schoolName):
    if schoolName == "" or schoolName == None:
        return []

    qlist = []
    query = db_ops.runQuery("SELECT className from Class WHERE school=%s", schoolName)

    for q in query:
        qlist.append(q['className'])
        
    return qlist

def getAttendanceList(schoolName, studentName, className, date):
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

    query = db_ops.runQuery(query_str)
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

def notifyParents(firstName, lastName, date, className):
    # First get the student ID given the info
    studentId = student_id_from_name(firstName, lastName)

    command = db_ops.runCommand("UPDATE Attendance \
        INNER JOIN Class ON Attendance.Class_classId = Class.classId \
        SET notified = '1' \
        WHERE Student_studentId=%s AND date=%s AND className=%s", studentId, date, className)
    return command

def updateAttendanceRecord(firstName, lastName, attendance, className,
    date, reason, verified, parentNotified):
    studentId = student_id_from_name(firstName, lastName)

    if studentId == "":
        return False

    db_ops.runCommand("UPDATE Attendance \
    INNER JOIN Class ON Attendance.Class_classId = Class.classId \
    SET status = %s, reason = %s, verified = %s, notified=%s\
    WHERE Student_studentId=%s AND date=%s AND className=%s", 
    attendance, reason, verified, parentNotified, 
    studentId, date, className)

    return True

def addParent(name, email, password):
    """
    return true if parent added to the db with their info, false otherwise
    """
    today = date.today()
    today = today.strftime("%m/%d/%y")
    firstName = name.split(" ")[0]
    lastName = name.split(" ")[1]
    command = "INSERT INTO schooldb1.Accounts (creationDate, email, password, firstName, lastName, type) VALUES (%s, %s, %s, %s, %s, %s);"
    try:
        db_ops.runCommand(command, today, email, password, firstName, lastName, "Parent")
        return True
    except Exception:
        return False

def checkIfParentExists(email):
    """
    return true if email already exists in db
    """
    query = db_ops.runQuery("Select * FROM schooldb1.Accounts Where email=%s", email)
    if len(query) == 0:
        return False
    return True

def removeParent(name):
    """
    remove the parent from the db
    """
    pass

def addTeacher(name, email, password, subject):
    """
    return true if teacher added to the db with their info, false otherwise
    """
    pass

def checkIfTeacherExists(name):
    """
    return true if name already exists in db
    """
    pass

def removeTeacher(name):
    """
    remove the teacher from the db
    """
    pass

def getAttendanceStatus(className, date):
    query_str = 'SELECT COUNT(*) FROM schooldb1.Attendance INNER JOIN Class ON Attendance.Class_classId = Class.classId'
    query_str += ' WHERE className="' + className + '" AND date="' + date + '"'
    query_count = db_ops.runQuery(query_str)[0]['COUNT(*)']
    
    if (query_count > 0):
        return True

    return False

def getChildren(email):
    qlist = []

    query_str = 'SELECT Students.firstName, Students.lastName, email, Class.school from Students \
                INNER JOIN Student_has_Class ON Students.studentId = Student_has_Class.Student_studentId \
                INNER JOIN Class ON Student_has_Class.Class_classId = Class.classId \
                INNER JOIN Student_has_Parent ON Students.studentId = Student_has_Parent.Student_studentId \
                INNER JOIN Accounts ON Accounts.accountId = Student_has_Parent.Account_parentId \
                WHERE Class.time = "9:00" AND email="' + email + '"'

    # TODO: filter by today's date too? TBC
    # query_str = 'SELECT Students.firstName, Students.lastName, email, status, Class.school from Attendance \
    #             INNER JOIN Student_has_Parent ON Attendance.Student_studentId = Student_has_Parent.Student_studentId \
    #             INNER JOIN Class ON Attendance.Class_classId = Class.classId \
    #             INNER JOIN Students ON Attendance.Student_studentId = Students.studentId \
    #             INNER JOIN Accounts ON Accounts.accountId = Student_has_Parent.Account_parentId \
    #             WHERE email="' + email + '"'

    query = db_ops.runQuery(query_str)

    for q in query:
        record = {}
        record['Name'] = q['firstName'] + ' ' + q['lastName']
        record['School'] = q['school']
        record['Attendance'] = 'Present'
        qlist.append(record)
    
    return qlist

def getChildStatusesToday(firstName, lastName, date):
    qList = []
    query_str = 'SELECT status from Attendance \
                INNER JOIN Class ON Attendance.Class_classId = Class.classId \
                INNER JOIN Students ON Attendance.Student_studentId = Students.studentId \
                WHERE firstName="' + firstName + '" AND lastName="' + lastName + '" AND date="' + date + '"' 
    query = db_ops.runQuery(query_str)

    for q in query:
        qList.append(q['status'])

    return qList

def getClassTime(className, schoolName):
    query_str = 'SELECT time FROM Class WHERE className="' + className + '" AND school="' + schoolName +'"'
    time = db_ops.runQuery(query_str)[0]['time']
    return time

def getClassStudentList(className, schoolName):
    # Gets all students in a given class (empty records)
    qList = []
    query_str = 'SELECT firstName, lastName FROM Student_has_Class \
                INNER JOIN Class ON Student_has_Class.Class_classId = Class.classId \
                INNER JOIN Students ON Student_has_Class.Student_studentId = Students.studentId \
                WHERE className="' + className + '" AND school="' + schoolName +'"'
    
    query = db_ops.runQuery(query_str)
    for q in query:
        record = {}
        record['Name'] = q['firstName'] + ' ' + q['lastName']
        record['Attendance'] = ''
        qList.append(record)
    
    return qList

def getExistingClassRecords(className, schoolName, date):
    # Gets all students in a class who have existing records
    qList = []
    query_str = 'SELECT firstName, lastName, status FROM Attendance \
                INNER JOIN Class ON Attendance.Class_classId = Class.classId \
                INNER JOIN Students ON Attendance.Student_studentId = Students.studentId \
                WHERE className="' + className + '" AND school="' + schoolName + '" AND date="' + date +'"'
    
    query = db_ops.runQuery(query_str)
    for q in query:
        record = {}
        record['Name'] = q['firstName'] + ' ' + q['lastName']
        record['Attendance'] = q['status']
        qList.append(record)
    
    return qList

def getChildClasses(firstName, lastName):
    qList = []
    query_str = 'SELECT className, time FROM Student_has_Class \
                INNER JOIN Class ON Student_has_Class.Class_classId = Class.classId \
                INNER JOIN Students ON Student_has_Class.Student_studentId = Students.studentId \
                WHERE firstName="' + firstName + '"'
    if (lastName != ''):
        query_str += ' AND lastName="' + lastName + '"'
    
    query = db_ops.runQuery(query_str)

    for q in query:
        record = {}
        record['className'] = q['className']
        record['classHour'] = q['time'].split(':')[0]
        qList.append(record)

    return qList

def getAttedanceRecords(name):
    """
    return the attendence record for the child with "name" for all their classes that day
    return format: list of lists
                    [["math", "late"], ["english", "present"], ["science", "absent"]]
    """
    pass

def reportChild(name, className, date, attendance, reason):
    """
    add the child's attendence record to the db
    """
    firstName = name.split(" ")[0]
    lastName = name.split(" ")[1]
    studentId = student_id_from_name(firstName, lastName)

    # check to see if row already in attendence table. If yes just update, if no then insert row
    query_str = 'SELECT * FROM schooldb1.Attendance INNER JOIN schooldb1.Class \
            ON schooldb1.Attendance.Class_classId = schooldb1.Class.classId \
            WHERE Student_studentId = "' + str(studentId) + '" and className = "' + str(className) + '" and date = "' + date +'"'
    queryResult = db_ops.runQuery(query_str)
    print(studentId)
    if len(queryResult) == 1:
        db_ops.runCommand("UPDATE schooldb1.Attendance INNER JOIN schooldb1.Class \
            ON schooldb1.Attendance.Class_classId = schooldb1.Class.classId \
            SET status = %s, reason = %s \
            WHERE Student_studentId=%s AND date=%s AND className=%s", attendance, reason, str(studentId), date, className)
    else:
        query_str = 'SELECT * FROM schooldb1.Class INNER JOIN schooldb1.Student_has_Class \
            ON schooldb1.Class.classId = schooldb1.Student_has_Class.Class_classId \
            WHERE className = "' + str(className) + '" and Student_studentId = "' + str(studentId) +'"'
        print("Here")
        query = db_ops.runQuery(query_str)
        classId = query[0]["classId"]
        print(classId)
        command = "INSERT INTO schooldb1.Attendance (date, Class_classId, Student_studentId, status, reason) VALUES (%s, %s, %s, %s, %s);"
        db_ops.runCommand(command, date, classId, str(studentId), attendance, reason)
    
    return True


def getTeacherHistoricalAttendance(schoolName, studentName, date, classList):
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

    query = db_ops.runQuery(query_str)

    for q in query:
        record = {}
        record['Name'] = q['firstName'] + ' ' + q['lastName']
        record['Attendance'] = q['status']
        record['Class'] = q['className']
        record['Date'] = q['date']
        qlist.append(record)
    
    return qlist

