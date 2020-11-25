import mysql.connector
import database.db_credentials as db
from mysql.connector import errorcode

params = {
    'user': db.USERNAME,
    'password': db.PASSWORD,
    'host': db.HOST,
    'database': db.DB_NAME,
    'port': db.PORT
}

def runCommand(command, *args):
    try:
        db_connector = mysql.connector.connect(**params)
        cur = db_connector.cursor(dictionary=True)

        cur.execute(command, args)

        db_connector.commit()
    except Exception as e:
        print('Error running command {}:\n{}'.format(command, e))
    
    finally:
        db_connector.close()
        db_connector.close()

def runQuery(query, *args):
    rowList = []
    try:
        db_connector = mysql.connector.connect(**params)
        cur = db_connector.cursor(dictionary=True)
        cur.execute(query, args)
        row = cur.fetchone()

        while row is not None:
            rowList.append(row)
            row = cur.fetchone()

    except Exception as e:
        print('Error running query {}:\n{}'.format(query, e))
    
    finally:
        db_connector.close()
        db_connector.close()
    
    return rowList





