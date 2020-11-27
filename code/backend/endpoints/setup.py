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
  email = data['email']

  schoolName = db_queries.getSchoolName(email)

  return jsonify(
    schoolName = schoolName
  )

@setup.route('/getListOfClasses', methods=['POST'])
def getListOfClasses():
  """
  Description: This endpoint gets the list of classes at the specified school
  Input Json Request: {
    schoolName
  }
  return: {
    listOfClasses: List[String]
  }
  """
  data = request.get_json()
  schoolName = data['schoolName']

  listOfClasses = db_queries.getListOfClasses(schoolName)

  return jsonify(
    classes = listOfClasses
  )

@setup.route('/getAttendanceList', methods=['POST'])
def getAttendanceList():
  data = request.get_json()
  studentName = data['studentName']
  className = data['className']
  
  # TO-DO: FIX DATE AND SCHOOL HARDCODING
  schoolName = 'Maplewood High School'
  #schoolName = data['schoolName']
  #date = int(data['date']) / 1000
  date = 1606440131548 / 1000
  date = datetime.datetime.fromtimestamp(date).strftime('%d/%m/%Y')
  # *****************************

  attendances = db_queries.getAttendanceList(schoolName, studentName, className, date)

  return jsonify(attendances)


