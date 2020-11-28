import database.db_ops as db_ops

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
    """
    Input (str): email of user 
    return (str): password of user
    """

    query = db_ops.runQuery("SELECT password from Accounts WHERE email=%s", email)
    if len(query) == 0:
        return ""
    return query[0]['password']


def getpersonType(email):
    """
    Input (str): email of person 
    return (str): type of individual Parent/Secretary/Teacher/None 
    """

    query = db_ops.runQuery("SELECT type from Accounts WHERE email=%s", email)
    if len(query) == 0:
        return "None"
    return query[0]['type']


def getSchoolName(email):
    """
    Input (str): email of secretary
    return (str): school name
    """
    query = db_ops.runQuery("SELECT school from Accounts WHERE email=%s", email)
    return query[0]['school']


def getListOfClasses(schoolName):
    """
    Input (str): name of school
    return List[str]: List of classes taught at school
        Example ['Math', 'English', 'Science']
    """

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

def addParent(name, email, password):
    """
    add the parent to the db with their info
    """
    pass

def checkIfParentExists(name):
    """
    return true if name already exists in db
    """
    pass

def removeParent(name):
    """
    remove the parent from the db
    """
    pass

def addTeacher(name, email, password, subject):
    """
    add the teacher to the db with their info
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
