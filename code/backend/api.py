
import json
from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
from endpoints import setup

import datetime

# Flask Setup
app = Flask(__name__)
app.register_blueprint(setup)
CORS(app)


@app.route('/')
def index():
    return "Welcome to the backend"

if __name__ == "__main__":
    app.run()