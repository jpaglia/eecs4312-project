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
    
    print("{}".format(classes))
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
    print(query)
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
    # TODO: filter by today's date too? TBC

    query_str = 'SELECT Students.firstName, Students.lastName, email, status, Class.school from Attendance \
                INNER JOIN Student_has_Parent ON Attendance.Student_studentId = Student_has_Parent.Student_studentId \
                INNER JOIN Class ON Attendance.Class_classId = Class.classId \
                INNER JOIN Students ON Attendance.Student_studentId = Students.studentId \
                INNER JOIN Accounts ON Accounts.accountId = Student_has_Parent.Account_parentId \
                WHERE email="' + email + '"'

    query = db_ops.runQuery(query_str)
    print(query)

    for q in query:
        record = {}
        record['Name'] = q['firstName'] + ' ' + q['lastName']
        record['School'] = q['school']
        record['Attendance'] = q['status']
        qlist.append(record)
    
    return qlist

def getClassTime(className):
    """
    Gets the class time of the class passed in
    Return: [hour, minute]
    """
    pass

def getClassStudentList(className):
    """
    Gets the students name and attendance for the class passed in
    Return: [[name, attendence], [name, attendence], ...]
    """
    pass