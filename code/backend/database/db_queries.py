import database.db_ops as db_ops


def getpassword(email):
    """
    Input (str): email of user 
    return (str): password of user
    """

    query = db_ops.runQuery("SELECT password from Accounts WHERE email=%s", email)
    return query[0]['password']


def getpersonType(email):
    """
    Input (str): email of person 
    return (str): type of individual Parent/Secretary/Teacher/None 
    """

    query = db_ops.runQuery("SELECT type from Accounts WHERE email=%s", email)
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

    qlist = []
    query = db_ops.runQuery("SELECT name from Class WHERE school=%s", schoolName)

    for q in query:
        qlist.append(q['name'])
        
    return qlist