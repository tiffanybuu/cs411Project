from flask import Flask 
from flask_cors import CORS
from sqlalchemy import create_engine, text
from sqlalchemy.engine.url import URL
from sqlalchemy_utils import create_database, database_exists

from .backend.users.routes import users


DATABASE = {
    'drivername': 'mysql+pymysql',
    'username': 'root',
    'password': '',
    'host': 'localhost',
    'database': '411_project'
}

def create_app(): 
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(users)



    # initialize database 411_project if it doesn't exist
    url = URL(**DATABASE)
    if not database_exists(url):
        create_database(url)


    # initalize the tables if doesn't exist
    engine = create_engine(url)
    with engine.connect() as con:
        table = text(
            '''CREATE TABLE IF NOT EXISTS User_Account(
                UserID VARCHAR(100) NOT NULL PRIMARY KEY,
                Password VARCHAR(100),
                FirstName VARCHAR(100),
                LastName VARCHAR(100),
                FollowingCount INT,
                FollowerCount INT
            )
            '''
        )
        con.execute(table)
    
    return app