from flask import Blueprint
from flask import Flask
from flask import request
from flask import jsonify
from database import db_queries
import json
import requests
import datetime

setup = Blueprint("setup", __name__)

@setup.route('/getPassword', methods=['GET'])
def getSampleInfo():
  return str(db_queries.getListOfClasses("York"))

@setup.route('/login', methods=['POST'])
def login():
  req_data = request.get_json()

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
  actual_password = db_queries.getpassword(email)
  persontype = db_queries.getpersonType(email)
  valid = False
  if actual_password == password:
    valid = True

  return jsonify(
    valid = valid,
    type = persontype
  )

@setup.route('/getSchoolName', methods=['POST'])
def getSchoolName():
  data = request.get_json()
  if not "email" in data:
    return "No Email found in request body", 400

  email = data['email']

  schoolName = db_queries.getSchoolName(email)

  return jsonify(
    schoolName = schoolName
  )

@setup.route('/getListOfClasses', methods=['POST'])
def getListOfClasses():
  data = request.get_json()

  if not "schoolName" in data:
    return "No School name found in request body", 400

  schoolName = data['schoolName']

  listOfClasses = db_queries.getListOfClasses(schoolName)
  if listOfClasses == []:
    return "No Classes Found", 404
  else:
    return jsonify(
      classes = listOfClasses
    )

@setup.route('/getAttendanceList', methods=['POST'])
def getAttendanceList():
  data = request.get_json()
  schoolName = data['schoolName']
  studentName = data['studentName']
  className = data['className']

  if data['date'] == None:
    d = ''
  else:
    date_int = int(data['date']) / 1000
    d = datetime.datetime.fromtimestamp(date_int).strftime('%d/%m/%Y')

  attendances = db_queries.getAttendanceList(schoolName, studentName, className, d)

  return jsonify(attendances)

@setup.route('/notifyParents', methods=['POST'])
def notifyParents():
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

    db_queries.notifyParents(firstName, lastName, mydate, className)

  return jsonify([])

@setup.route('/updateAttendanceRecord', methods=['POST'])
def updateAttendanceRecord():
  data = request.get_json()
  if "Name" not in data:
    return "No key 'Name' in request body", 400
  if "Attendance" not in data:
    return "No key 'Attendance' in request body", 400
  if "Class" not in data:
    return "No key 'Class' in request body", 400
  if "Date" not in data:
    return "No key 'Date' in request body", 400
  if "Reason For Absence" not in data:
    return "No key 'Reason' in request body", 400
  if "Reason Verified" not in data:
    return "No key 'Reason Verified' in request body", 400
  if "Parent Notified" not in data:
    return "No key 'Parent Notified' in request body", 400

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
   
  result = db_queries.updateAttendanceRecord(firstName, lastName, attendance, className,
    mydate, reason, verified, parentNotified)
  return jsonify(result)

# Filter by class is optional
@setup.route('/getStudentRecords', methods=['POST'])
def getStudentRecords():
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

  result = db_queries.getStudentRecords(name, date, className) 
  return jsonify(result)

@setup.route('/getTeacherClasses', methods=['POST'])
def getTeacherClasses():
  data = request.get_json()

  if 'email' not in data:
    return "key 'email' not found in request body", 400
  email = data["email"]

  classes = db_queries.getTeacherClasses(email)

  return jsonify(classes)

@setup.route('/addParent', methods=['POST'])
def addParent():
  data = request.get_json()

  if 'Name' not in data:
    return "key 'Name' not found in request body", 400
  if 'Email' not in data:
    return "key 'Email' not found in request body", 400
  if 'Password' not in data:
    return "key 'Password' not found in request body", 400

  name = data['Name']
  email = data['Email']
  password = data['Password']

  if (db_queries.checkIfParentExists(email)):
    return jsonify(
      valid = "False"
    )
  added = db_queries.addParent(name, email, password)
  return jsonify(
      valid = added
    )

@setup.route('/removeParent', methods=['POST'])
def removeParent():
  data = request.get_json()

  if 'Name' not in data:
    return "key 'Name' not found in request body", 400

  name = data['Name']

  db_queries.removeParent(name)
  return jsonify(
    valid = "True"
  )

@setup.route('/addTeacher', methods=['POST'])
def addTeacher():
  data = request.get_json()

  if 'Name' not in data:
    return "key 'Name' not found in request body", 400
  if 'Email' not in data:
    return "key 'Email' not found in request body", 400
  if 'Password' not in data:
    return "key 'Password' not found in request body", 400
  if 'Class' not in data:
    return "key 'Class' not found in request body", 400

  name = data['Name']
  email = data['Email']
  password = data['Password']
  subject = data['Class']

  if (db_queries.checkIfTeacherExists(name)):
    return jsonify(
      valid = "False"
    )
  added = db_queries.addTeacher(name, email, password, subject)
  return jsonify(
      valid = added
    )

@setup.route('/removeTeacher', methods=['POST'])
def removeTeacher():
  data = request.get_json()

  if 'Name' not in data:
    return "key 'Name' not found in request body", 400

  name = data['Name']

  db_queries.removeTeacher(name)
  return jsonify(
    valid = "True"
  )

@setup.route('/getAttendanceStatus', methods=['POST'])
def getAttendanceStatus():
  data = request.get_json()
  className = data['className']
  date = data['date']
  date = int(date) / 1000
  date = datetime.datetime.fromtimestamp(date).strftime('%d/%m/%Y')
  
  result = db_queries.getAttendanceStatus(className, date)
  return jsonify(result)

@setup.route('/getChildren', methods=['POST'])
def getChildren():
  data = request.get_json()
  email = data["email"]

  result = []
  priorities = {'Absent':1, 'Late':2, 'Present':3}

  # Get all children
  queryList = db_queries.getChildren(email)

  # Get today's status for each child
  now = datetime.datetime.now().timestamp()
  today = datetime.datetime.fromtimestamp(now).strftime('%d/%m/%Y')
    
  for child in queryList:
    firstName = child['Name'].split(' ')[0]
    lastName = child['Name'].split(' ')[1]
    att = child['Attendance']

    attendanceStatusList = db_queries.getChildStatusesToday(firstName, lastName, today)
    for status in attendanceStatusList:
      if (priorities[status] < priorities[att]):
        child['Attendance'] = status
        att = status
    result.append(child)

  return jsonify(result)

@setup.route('/getClassData', methods=['POST'])
def getClassData():
  data = request.get_json()
  className = data['className']
  schoolName = data['schoolName']
  
  hour = db_queries.getClassTime(className, schoolName)
  hour = hour.split(':')[0]
  studentList = db_queries.getClassStudentList(className, schoolName)

  now = datetime.datetime.now().timestamp()
  today = datetime.datetime.fromtimestamp(now).strftime('%d/%m/%Y')
  existingRecordsList = db_queries.getExistingClassRecords(className, schoolName, today)
  
  combinedList = []
  for student in studentList:
    exists = False
    for r in existingRecordsList:
      if student['Name'] in r['Name']:
        combinedList.append(r)
        exists = True
    if (exists == False):
      combinedList.append(student)

  return jsonify(
    classHour = hour,
    studentList = combinedList
  )

@setup.route('/getChildClasses', methods=['POST'])
def getChildClasses():
  data = request.get_json()

  if ' ' in data['name']:
    firstName = data['name'].split(' ')[0]
    lastName = data['name'].split(' ')[1]
  else:
    firstName = data['name']
    lastName = ''

  classList = db_queries.getChildClasses(firstName, lastName)

  return jsonify(classList)

@setup.route('/getNotifications', methods=['POST'])
def getNotifications():
  data = request.get_json()
  name = data['name']

  records = db_queries.getAttedanceRecords(name)

  return jsonify(records)

@setup.route('/reportChild', methods=['POST'])
def reportChild():
  data = request.get_json()
  name = data['name']
  className = data['className']
  date = data['date']
  date = int(date) / 1000
  date = datetime.datetime.fromtimestamp(date).strftime('%d/%m/%Y')
  
  attendance = data['Attendance']
  reason = data['Reason']
  result = db_queries.reportChild(name, className, date, attendance, reason)
  return jsonify(
    valid = result
  )

@setup.route('/getTeacherHistoricalAttendanceList', methods=['POST'])
def getTeacherHistoricalAttendanceList():
  data = request.get_json()

  schoolName = data['schoolName']
  studentName = data['studentName']
  classList = data['classList']
  
  if data['date'] == None:
    d = ''
  else:
    date_int = int(data['date']) / 1000
    d = datetime.datetime.fromtimestamp(date_int).strftime('%d/%m/%Y')

  attendances = db_queries.getTeacherHistoricalAttendance(schoolName, studentName, d, classList)

  return jsonify(attendances)

@setup.route('/addRecords', methods=['POST'])
def addRecords():
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
    db_queries.addRecord(className, firstName, lastName, attendance, schoolName)

  return jsonify(
    valid = True
  )

@setup.route('/searchRecords', methods=['POST'])
def searchRecords():
  data = request.get_json()
  firstName = data['name'].split(' ')[0]
  lastName = data['name'].split(' ')[1]
  schoolName = data['schoolName']
  recordType = data['type']

  result = db_queries.recordExists(firstName, lastName, recordType, schoolName)
  
  return jsonify(result)

