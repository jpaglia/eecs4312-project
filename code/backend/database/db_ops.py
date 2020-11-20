import mysql.connector
import database.db_credentials as db


params = {
    'user': db.USERNAME,
    'password': db.PASSWORD,
    'host': db.HOST,
    'database': db.DB_NAME,
}

