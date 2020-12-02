from flask import Blueprint
from flask import Flask
from flask import request
from flask import jsonify
from database import db_queries
from database import db_credentials as db
import json
import requests
import datetime

params = {
    'user': db.USERNAME,
    'password': db.PASSWORD,
    'host': db.HOST,
    'database': db.DB_NAME,
    'port': db.PORT
}
setup = Blueprint("setup", __name__)

@setup.route('/getPassword', methods=['GET'])
def getSampleInfo():
  dbw = db_queries.DbWrapper()
  dbw.close()
  return str(dbw.getListOfClasses("York"))

@setup.route('/login', methods=['POST'])
def login():
  req_data = request.get_json()
  dbw = db_queries.DbWrapper()

  # Return invalid if no email/password included in request
  # Can also return an http 400 response
  if not ("email" in req_data) or not("password" in req_data):
      return jsonify(valid = False)

  email = req_data['email'] 
  password = req_data['password']
  if email == "" or password == "":
    return jsonify(
      valid = False,
      type = None
    )
  actual_password = dbw.getpassword(email)
  persontype = dbw.getpersonType(email)
  valid = False
  if actual_password == password:
    valid = True

  dbw.close()
  return jsonify(
    valid = valid,
    type = persontype
  )

@setup.route('/getSchoolName', methods=['POST'])
def getSchoolName():
  dbw = db_queries.DbWrapper()
  data = request.get_json()
  if not "email" in data:
    return "No Email found in request body", 400

  email = data['email']

  schoolName = dbw.getSchoolName(email)

  dbw.close()
  return jsonify(
    schoolName = schoolName
  )

@setup.route('/getListOfClasses', methods=['POST'])
def getListOfClasses():
  dbw = db_queries.DbWrapper()
  data = request.get_json()

  if not "schoolName" in data:
    return "No School name found in request body", 400

  schoolName = data['schoolName']

  listOfClasses = dbw.getListOfClasses(schoolName)
  dbw.close()
  if listOfClasses == []:
    return "No Classes Found", 404
  else:
    return jsonify(
      classes = listOfClasses
    )

@setup.route('/getAttendanceList', methods=['POST'])
def getAttendanceList():
  dbw = db_queries.DbWrapper()
  data = request.get_json()
  schoolName = data['schoolName']
  studentName = data['studentName']
  className = data['className']

  if data['date'] == None:
    d = ''
  else:
    date_int = int(data['date']) / 1000
    d = datetime.datetime.fromtimestamp(date_int).strftime('%d/%m/%Y')

  attendances = dbw.getAttendanceList(schoolName, studentName, className, d)
  dbw.close()
  return jsonify(attendances)

@setup.route('/notifyParents', methods=['POST'])
def notifyParents():
  dbw = db_queries.DbWrapper()
  data = request.get_json()

  for d in data:
    if not "Name" in d:
      return "keyname 'Name' not found in body: {}".format(d), 400
    elif not "Date" in d:
      return "keyname 'Date' not found in body: {}".format(d), 400
    elif not "Class" in d:
      return "keyname 'Class' not found in body: {}".format(d), 400

  for d in data:
    name = d["Name"]
    firstName = name.split(" ")[0]
    lastName = name.split(" ")[1]

    mydate = d["Date"]

    className = d["Class"]

    dbw.notifyParents(firstName, lastName, mydate, className)
  dbw.close()
  return jsonify([])

@setup.route('/updateAttendanceRecord', methods=['POST'])
def updateAttendanceRecord():
  dbw = db_queries.DbWrapper()
  data = request.get_json()

  firstName = data["Name"].split(" ")[0]
  lastName = data["Name"].split(" ")[1]
  attendance = data["Attendance"]
  className = data["Class"]
  mydate = data["Date"] # No need for date conversion here
  reason = data["Reason For Absence"]
  verified = data["Reason Verified"]

  parentNotified = data["Parent Notified"]
  if parentNotified == 'Y':
    parentNotified = True
  else:
    parentNotified = False
   
  result = dbw.updateAttendanceRecord(firstName, lastName, attendance, className,
    mydate, reason, verified, parentNotified)
  
  dbw.close()
  return jsonify(result)

# Filter by class is optional
@setup.route('/getStudentRecords', methods=['POST'])
def getStudentRecords():
  dbw = db_queries.DbWrapper()
  data = request.get_json()
  className = ''

  if not "Name" in data:
    return "No key 'Name' in request body", 400
  if not "date" in data:
    return "No key 'date' in request body", 400
  if "className" in data:
    className = data['className']

  name = data['Name']
  date = data['date']

  date = int(date) / 1000
  date = datetime.datetime.fromtimestamp(date).strftime('%d/%m/%Y')

  result = dbw.getStudentRecords(name, date, className) 
  dbw.close()
  return jsonify(result)

@setup.route('/getTeacherClasses', methods=['POST'])
def getTeacherClasses():
  dbw = db_queries.DbWrapper()
  
  data = request.get_json()

  if 'email' not in data:
    return "key 'email' not found in request body", 400
  email = data["email"]

  # classes = db_queries.getTeacherClasses(email)
  classes = dbw.getTeacherClasses(email)
  dbw.close()

  return jsonify(classes)

@setup.route('/addParent', methods=['POST'])
def addParent():
  dbw = db_queries.DbWrapper()
  data = request.get_json()

  name = data['Name']
  email = data['Email']
  password = data['Password']
  childList = data['ChildList']

  if (dbw.accountExists(email)):
    return jsonify(
      valid = False,
      message = 'Parent Exists with Email: {}'.format(email)
    )
  added = dbw.addPerson(name, email, password, "Parent")
  associated = dbw.setParentChildren(name, childList)
  result = added and associated

  if (result):
    msg = '{} has been added to the system'.format(name)
  else:
    msg = '{} could not be added to the system'.format(name)

  dbw.close()
  return jsonify(
      valid = result,
      message = msg
    )

@setup.route('/removePerson', methods=['POST'])
def removePerson():
  dbw = db_queries.DbWrapper()
  data = request.get_json()

  name = data['Name']

  removed = dbw.removePerson(name)
  dbw.close()
  return jsonify(
    valid = removed
  )

@setup.route('/addTeacher', methods=['POST'])
def addTeacher():
  data = request.get_json()
  dbw = db_queries.DbWrapper()

  name = data['Name']
  email = data['Email']
  password = data['Password']
  classList = data['ClassList']
  schoolName = data['schoolName']

  if (dbw.accountExists(email)):
    return jsonify(
      valid = False,
      message = 'Teacher with name Exists: {}'.format(name)
    )
  added = dbw.addPerson(name, email, password, "Teacher")
  associated = dbw.setTeacherClasses(name, classList, schoolName)
  dbw.close()
  result = added and associated

  if (result):
    msg = '{} has been added to the system'.format(name)
  else:
    msg = '{} could not be added to the system'.format(name)
  
  dbw.close()
  return jsonify(
      valid = result,
      message = msg
    )

@setup.route('/getAttendanceStatus', methods=['POST'])
def getAttendanceStatus():
  dbw = db_queries.DbWrapper()
  data = request.get_json()
  className = data['className']
  date = data['date']
  date = int(date) / 1000
  date = datetime.datetime.fromtimestamp(date).strftime('%d/%m/%Y')
  
  result = dbw.getAttendanceStatus(className, date)
  dbw.close()
  return jsonify(result)

@setup.route('/getChildren', methods=['POST'])
def getChildren():
  dbw = db_queries.DbWrapper()
  data = request.get_json()
  email = data["email"]

  result = []
  priorities = {'Absent':1, 'Late':2, 'Present':3}

  # Get all children
  queryList = dbw.getChildren(email)

  # Get today's status for each child
  now = datetime.datetime.now().timestamp()
  today = datetime.datetime.fromtimestamp(now).strftime('%d/%m/%Y')
    
  for child in queryList:
    firstName = child['Name'].split(' ')[0]
    lastName = child['Name'].split(' ')[1]
    att = child['Attendance']

    attendanceStatusList = dbw.getChildStatusesToday(firstName, lastName, today)
    for status in attendanceStatusList:
      if (priorities[status] < priorities[att]):
        child['Attendance'] = status
        att = status
    result.append(child)

  dbw.close()
  return jsonify(result)

@setup.route('/getClassData', methods=['POST'])
def getClassData():
  dbw = db_queries.DbWrapper()
  data = request.get_json()
  className = data['className']
  schoolName = data['schoolName']
  
  hour = dbw.getClassTime(className, schoolName)
  hour = hour.split(':')[0]
  studentList = dbw.getClassStudentList(className, schoolName)

  now = datetime.datetime.now().timestamp()
  today = datetime.datetime.fromtimestamp(now).strftime('%d/%m/%Y')
  existingRecordsList = dbw.getExistingClassRecords(className, schoolName, today)
  
  combinedList = []
  for student in studentList:
    exists = False
    for r in existingRecordsList:
      if student['Name'] in r['Name']:
        combinedList.append(r)
        exists = True
    if (exists == False):
      combinedList.append(student)

  dbw.close()
  return jsonify(
    classHour = hour,
    studentList = combinedList
  )

@setup.route('/getChildClasses', methods=['POST'])
def getChildClasses():
  dbw = db_queries.DbWrapper()
  data = request.get_json()

  if ' ' in data['name']:
    firstName = data['name'].split(' ')[0]
    lastName = data['name'].split(' ')[1]
  else:
    firstName = data['name']
    lastName = ''

  classList = dbw.getChildClasses(firstName, lastName)

  dbw.close()
  return jsonify(classList)

@setup.route('/getNotifications', methods=['POST'])
def getNotifications():
  dbw = db_queries.DbWrapper()
  data = request.get_json()
  name = data['name']

  records = dbw.getAttedanceRecords(name)

  dbw.close()
  return jsonify(records)

@setup.route('/reportChild', methods=['POST'])
def reportChild():
  dbw = db_queries.DbWrapper()
  data = request.get_json()
  name = data['name']
  className = data['className']
  date = data['date']
  date = int(date) / 1000
  date = datetime.datetime.fromtimestamp(date).strftime('%d/%m/%Y')
  
  attendance = data['Attendance']
  reason = data['Reason']
  result = dbw.reportChild(name, className, date, attendance, reason)
  dbw.close()
  return jsonify(
    valid = result
  )

@setup.route('/getTeacherHistoricalAttendanceList', methods=['POST'])
def getTeacherHistoricalAttendanceList():
  dbw = db_queries.DbWrapper()
  data = request.get_json()

  schoolName = data['schoolName']
  studentName = data['studentName']
  classList = data['classList']
  
  if data['date'] == None:
    d = ''
  else:
    date_int = int(data['date']) / 1000
    d = datetime.datetime.fromtimestamp(date_int).strftime('%d/%m/%Y')

  attendances = dbw.getTeacherHistoricalAttendance(schoolName, studentName, d, classList)
  dbw.close()
  return jsonify(attendances)

@setup.route('/addRecords', methods=['POST'])
def addRecords():
  dbw = db_queries.DbWrapper()
  data = request.get_json()
  if 'className' not in data:
    return "key 'className' not found in request body", 400
  if 'classList' not in data:
    return "key 'classList' not found in request body", 400

  className = data["className"]
  classList = data["classList"]
  schoolName = data["schoolName"]
  for student in classList:
    firstName = student["Name"].split(" ")[0]
    lastName = student["Name"].split(" ")[1]
    attendance = student["Attendance"]
    dbw.addRecord(className, firstName, lastName, attendance, schoolName)
  dbw.close()
  return jsonify(
    valid = True
  )

@setup.route('/searchRecords', methods=['POST'])
def searchRecords():
  dbw = db_queries.DbWrapper()
  data = request.get_json()
  firstName = data['name'].split(' ')[0]
  lastName = data['name'].split(' ')[1]
  schoolName = data['schoolName']
  recordType = data['type']

  result = dbw.recordExists(firstName, lastName, recordType, schoolName)
  dbw.close()
  return jsonify(result)

