from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text
from sqlalchemy.engine.url import URL
from sqlalchemy_utils import create_database, database_exists

from .db.db import db
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
app.config['SQLALCHEMY_DATABASE_URI'] = url
#postgres://yfkvendmtqdwwj:8de67524b7fd2873df13a55a8eb134b6e924ba722ad58a49b10f438567017393@ec2-34-204-121-199.compute-1.amazonaws.com:5432/dfvvrig0r37a1
app.config['SECRET_KEY'] = 'secret'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# initialize Flask SQLAlchemy 
db.init_app(app)
db = SQLAlchemy()


#initalize the tables if doesn't exist
engine = create_engine(url)
with engine.connect() as con:
    table = text(
        '''CREATE TABLE IF NOT EXISTS User_Account(
            UserID VARCHAR(255) NOT NULL PRIMARY KEY,
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
            PlaylistID VARCHAR(255) NOT NULL PRIMARY KEY,
            UserID VARCHAR(255),
            Title VARCHAR(100),
            Description VARCHAR(100),
            DateCreated VARCHAR(100),
            PlaylistCount INT DEFAULT 0,
            FOREIGN KEY (UserID) REFERENCES User_Account(UserID)
                ON DELETE CASCADE
        )
        ''' 
    )
    con.execute(table)

    table = text(
        '''CREATE TABLE IF NOT EXISTS Tags(
            TagName VARCHAR(100) NOT NULL,
            PlaylistID VARCHAR(255) NOT NULL,
            FOREIGN KEY (PlaylistID) REFERENCES Playlist(PlaylistID)
            ON DELETE CASCADE
        )
        '''
    )
    con.execute(table)

    table = text(
        '''CREATE TABLE IF NOT EXISTS PlaylistEntry(
            SongID VARCHAR(255) NOT NULL PRIMARY KEY,
            PlaylistID VARCHAR(255),
            SongTitle VARCHAR(100),
            SongURL VARCHAR(100),
            Source VARCHAR(100),
            FOREIGN KEY (PlaylistID) REFERENCES Playlist(PlaylistID)
                ON DELETE CASCADE
        )
        ''' 
    )
    con.execute(table)

    # stored_procedure = text(
    #     '''CREATE PROCEDURE Popular_Playlist_Songs(
    # IN tag VARCHAR(255),
    # IN newPlaylistID VARCHAR(255),
    # IN playlistID VARCHAR(255)
    # )

    # BEGIN 
    # DECLARE done INT default 0;
    # DECLARE songURL_v VARCHAR(255);
    # DECLARE songTitle_v VARCHAR(100);
    # DECLARE source_v VARCHAR(100);

    
    # DECLARE songs_cur CURSOR
    # FOR
    # SELECT DISTINCT p.SongURL, p.SongTitle, p.Source
    # FROM PlaylistEntry p
    # INNER JOIN 
	# 	(SELECT DISTINCT PlaylistID, PlaylistCount
    #     FROM Tags NATURAL JOIN Playlist 
    #     WHERE TagName = tag
    #     ORDER BY PlaylistCount DESC
    #     LIMIT 3) as p2
	# ON p.PlaylistID = p2.PlaylistID;
    
    # DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    # OPEN songs_cur;
    # REPEAT
    #     FETCH songs_cur INTO songURL_v, songTitle_v, source_v;
    #     IF songURL_v NOT IN (SELECT SongURL FROM PlaylistEntry WHERE PlaylistID = newPlaylistID) 
    #     INSERT IGNORE INTO PlaylistEntry(SongID, PlaylistID, SongTitle, Source, SongURL) VALUES (CONCAT(newPlaylistID, "-", songURL_v), newPlaylistID, songTitle_v, source_v, songURL_v);
    # UNTIL done 
    # END REPEAT;

    # CLOSE songs_cur;

    # END;

    # '''
    # )
    # con.execute(stored_procedure)


    
    # stored_procedure = text(
    #     '''CREATE PROCEDURE Generate_Playlist(
    #         IN tag VARCHAR(255),
    #         IN playlistID VARCHAR(255),
    #         IN userID VARCHAR(255)
    #         )

    #         BEGIN 
    #         DECLARE done INT default 0;
    #         DECLARE songURL_v VARCHAR(255);
    #         DECLARE songTitle_v VARCHAR(100);
    #         DECLARE source_v VARCHAR(100);
    #         DECLARE totCount_v INT;	

#             DECLARE song_countcur CURSOR
    #         FOR
    #         SELECT SongURL, SongTitle, Source, COUNT(SongURL)
    #         FROM Tags NATURAL JOIN PlaylistEntry 
    #         WHERE TagName = tag 
    #         GROUP BY SongURL, SongTitle, Source
    #         HAVING COUNT(SongURL) > 1
    #         ORDER BY COUNT(SongURL) DESC;
    
            
    #         DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    #         OPEN song_countcur;
    #         REPEAT
    #             FETCH song_countcur INTO songURL_v, songTitle_v, source_v, totCount_v;
    #             INSERT IGNORE INTO PlaylistEntry(SongID, PlaylistID, SongTitle, Source, SongURL) VALUES (CONCAT(playlistID, "-", songURL_v), playlistID, songTitle_v, source_v, songURL_v);
    #             END IF;
    #         UNTIL done 
    #         END REPEAT;

    #         CLOSE song_countcur;

    #         END;
    #     '''
    # )
    # con.execute(stored_procedure)

    # return app
    