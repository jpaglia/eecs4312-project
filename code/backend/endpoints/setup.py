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
  """
  Description: This endpoint checks to see if a user enters a password properly
  Input Json Request: {
    email, 
    password
  }
  return: {
    valid: Bool 
    type: str -- type of user
  }
  """

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

  if not "schoolName" in data:
    return jsonify([])

  studentName = ''
  className = ''
  date = ''

  if "studentName" in data:
    studentName = data['studentName']
  
  if "className" in data:
    className = data['className']

  if "date" in data:
    date = data['date']
  
  # TO-DO: FIX DATE AND SCHOOL HARDCODING
  schoolName = 'Maplewood High School'
  #schoolName = data['schoolName']
  #date = int(data['date']) / 1000
  date = 1606440131548 / 1000
  date = datetime.datetime.fromtimestamp(date).strftime('%d/%m/%Y')
  # *****************************

  attendances = db_queries.getAttendanceList(schoolName, studentName, className, date)

  return jsonify(attendances)


@setup.route('/notifyParents', methods=['POST'])
def notifyParents():
  """
  Description: This endpoint adds the parent according to the inputs
  Input Json Request: {
    Name - Name of Student FirstName and LastName
    Date - Date 
    Class - Class Name
  }
  """
  data = request.get_json()
  for d in data:
    name = d["Name"]
    firstName = name.split(" ")[0]
    lastName = name.split(" ")[1]
    date = d["Date"]
    className = d["Class"]
    db_queries.notifyParents(firstName, lastName, date, className)
  return jsonify([])

@setup.route('/updateAttendanceRecord', methods=['POST'])
def updateAttendanceRecord():
  """
  Disscription: Endpoint updates attendence record for of student- reason for sick 
  { 'Name': 'Billy', 
  'Attendance': "Late", 
  'Class': "Math", 
  'Date': '02/04/20', 
  'Reason For Absence': 'Billy was sick', 
  'Reason Verified': false, 
  'Parent Notified': 'N' }
  """
  data = request.get_json()
  if "Name" not in data:
    return "No key 'Name' in request body", 400
  if "Attendance" not in data:
    return "No key 'Name' in request body", 400
  if "Class" not in data:
    return "No key 'Name' in request body", 400
  if "Date" not in data:
    return "No key 'Name' in request body", 400
  if "Reason For Absence" not in data:
    return "No key 'Name' in request body", 400
  if "Reason Verified" not in data:
    return "No key 'Name' in request body", 400
  if "Parent Notified" not in data:
    return "No key 'Name' in request body", 400

  firstName = data["Name"].split(" ")[0]
  lastName = data["Name"].split(" ")[1]
  attendence = data["Attendance"]
  date = data["Date"]
  reason = data["Reason For Absence"]
  verified = data["Reason Verified"]
  parentNotified = data["Parent Notified"]
  db_queries.updateAttendanceRecord(firstName, lastName, attendence, 
    date, reason, verified, parentNotified)
  return jsonify([])

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
  """
  Description: This endpoint adds the parent according to the inputs
  Input Json Request: {
    name
    email
    password
  }
  return: {
    valid: boolean
  }
  """
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
  """
  Description: This endpoint removes the selected parent
  Input Json Request: {
    name
  }
  return: {
    valid: boolean
  }
  """
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
  """
  Description: This endpoint adds the teacher according to the inputs
  Input Json Request: {
    name
    email
    password
    class
  }
  return: {
    valid: boolean
  }
  """
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
  """
  Description: This endpoint removes the selected teacher
  Input Json Request: {
    name
  }
  return: {
    valid: boolean
  }
  """
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
  className = ''
  if not "date" in data:
    return "No key 'date' in request body", 400
  if "className" in data:
    className = data['className']

  date = data['date']

  date = int(date) / 1000
  date = datetime.datetime.fromtimestamp(date).strftime('%d/%m/%Y')
  result = db_queries.getAttendanceStatus(className, date)
  return jsonify(result)


@setup.route('/getChildren', methods=['POST'])
def getChildren():
  """
  Description: gets children of parent
    Input Json Request: {
    email:
  }
  returns ["Child1", "Child2"]
  """
  data = request.get_json()
  if not "email" in data:
    return "No key 'date' in request body", 400

  email = data["email"]
  result = db_queries.getChildren(email)
  return jsonify(result)

@setup.route('/getClassData', methods=['POST'])
def getClassData():
  data = request.get_json()
  
  if not "className" in data:
    return "No key 'className' in request body", 400
  
  className = data['className']
  
  [hour, minute] = db_queries.getClassTime(className)
  studentList = db_queries.getClassStudentList(className)

  classTimeDict = {"hour": hour, "min": minute}
  
  studentListDict = []
  for i in studentList:
    name = i[0]
    attendance = i[1]
    studentDict = {"Name": name, "Attendance": attendance}
    studentListDict.append(studentDict)
  
  return jsonify(
    classTime = classTimeDict,
    studentList = studentListDict
  )