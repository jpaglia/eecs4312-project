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
  """
  Description: This endpoint gets the school name based on the email
  Input Json Request: {
    email
  }
  return: {
    schoolName: String
  }
  """
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


