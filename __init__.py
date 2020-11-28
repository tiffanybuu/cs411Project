from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text
from sqlalchemy.engine.url import URL
from sqlalchemy_utils import create_database, database_exists

# from .db.db import db
from .backend.users.routes import users
from .backend.playlists.routes import playlists

DATABASE = {
    'drivername': 'mysql+pymysql',
    'username': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'cs411_project'
}

# def create_app(): 
app = Flask(__name__)
CORS(app)


# registering blueprints
app.register_blueprint(users)
app.register_blueprint(playlists)

# initialize database 411_project if it doesn't exist
url = URL(**DATABASE)
if not database_exists(url):
    create_database(url)

# sqlalchemy database configuration with mysql 
# url
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://yfkvendmtqdwwj:8de67524b7fd2873df13a55a8eb134b6e924ba722ad58a49b10f438567017393@ec2-34-204-121-199.compute-1.amazonaws.com:5432/dfvvrig0r37a1'
app.config['SECRET_KEY'] = 'secret'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# initialize Flask SQLAlchemy 
# db.init_app(app)
db = SQLAlchemy(app)


#initalize the tables if doesn't exist
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

    table = text(
        '''CREATE TABLE IF NOT EXISTS Playlist(
            PlaylistID VARCHAR(100) NOT NULL PRIMARY KEY,
            UserID VARCHAR(100),
            Title VARCHAR(100),
            Description VARCHAR(100),
            DateCreated VARCHAR(100),
            FOREIGN KEY (UserID) REFERENCES User_Account(UserID)
                ON DELETE CASCADE
        )
        ''' 
    )
    con.execute(table)

    table = text(
        '''CREATE TABLE IF NOT EXISTS Tags(
            TagName VARCHAR(100) NOT NULL,
            PlaylistID VARCHAR(100) NOT NULL,
            FOREIGN KEY (PlaylistID) REFERENCES Playlist(PlaylistID)
            ON DELETE CASCADE
        )
        '''
    )
    con.execute(table)

    table = text(
        '''CREATE TABLE IF NOT EXISTS PlaylistEntry(
            SongID VARCHAR(100) NOT NULL PRIMARY KEY,
            PlaylistID VARCHAR(100),
            SongTitle VARCHAR(100),
            SongURL VARCHAR(100),
            Source VARCHAR(100),
            Position INT(100),
            FOREIGN KEY (PlaylistID) REFERENCES Playlist(PlaylistID)
                ON DELETE CASCADE
        )
        ''' 
    )
    con.execute(table)

    # return app