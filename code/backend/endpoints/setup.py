from flask import Blueprint
from flask import Flask
from flask import request
from flask import jsonify
from database import db_queries
import json
import requests

setup = Blueprint("setup", __name__)

@setup.route('/getSampleInfo', methods=['GET'])
def getSampleInfo():
  return 'Hello'

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
