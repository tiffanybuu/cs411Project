from datetime import date
from collections import defaultdict
from flask import Blueprint, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text
from sqlalchemy.engine.url import URL
# from cs411 import db
# from cs411.backend.response import send_response
from cs411Project import db
from cs411Project.backend.response import send_response

DATABASE = {
    'drivername': 'mysql+pymysql',
    'username': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'cs411_project'
}
url = URL(**DATABASE)

playlists = Blueprint('playlists', __name__)

# create a new playlist
@playlists.route('/new-playlist/<userID>', methods=['POST'])
def new_playlist(userID):
    data = request.get_json()

    # userID = data.get('userID')
    title = data.get('title')
    description = data.get('description')

    # create unique playlistID identifier
    # important! format = (userID-title), where spaces in original title are
    # replaced with '-'
    id_title = title.replace(" ", "-")
    playlistID = userID+'-'+id_title

    # get current date
    # format = Month-Day-YYYY
    today = date.today()
    dateCreated = today.strftime("%b-%d-%Y")

    if not title:
        return send_response(status=400, message="Title for your playlist is required")

    # check to see if user has a playlist with the same title already
    result = db.session.execute(
        "SELECT PlaylistID From Playlist WHERE PlaylistID = :playlistID",
        {"playlistID": playlistID}
    )
    result = result.fetchone()
    if result is None:
        try:
            # create the playlist
            result = db.session.execute(
                '''INSERT INTO Playlist (PlaylistID, UserID, Title, Description, DateCreated)
                    VALUES (:playlistID, :userID, :title, :description, :dateCreated)''',
                    {"playlistID": playlistID, "userID": userID, "title": title, "description": description,
                    "dateCreated": dateCreated}
            )
            db.session.commit()
        except Exception as e:
            print(e)
            return send_response(status=500, message="Oops, something went wrong. Try again")
    else:
        return send_response(status=409, message="You already have a playlist with this title, choose another name!")

    result = db.session.execute(
        '''SELECT * FROM Playlist WHERE UserID = :userID AND
        Title = :title''', {"userID": userID, "title": title}
    )
    playlist = result.fetchone()
    return send_response(status=200, data=
        {
            "Playlist": {
                "PlaylistID": playlist.PlaylistID,
                "Title": playlist.Title,
                "Description": playlist.Description,
                "DateCreated": playlist.DateCreated,
            }
        }
    )

# get a user's total number of playlists
@playlists.route('/get-playlists/<userID>', methods=['GET'])
def get_playlists(userID):

    result = db.session.execute(
        "SELECT * From Playlist WHERE userID = :userID",
        {"userID": userID}
    )
    playlists_list = []
    for playlist in result:
        playlists_list.append(
            {
                "PlaylistID": playlist.PlaylistID,
                "Title": playlist.Title,
                "Description": playlist.Description,
                "DateCreated": playlist.DateCreated,
            }
        )
    return send_response(status=200, data={"Playlists": playlists_list})

# search for playlists from a given query
@playlists.route('/search-playlists/<query>', methods=['GET'])
def search_playlist(query):
    # result = db.session.execute(
    #     "SELECT * FROM Playlist WHERE Title LIKE '%{0}%' OR Description LIKE '%{0}%'"
    #     .format(query)
    # )
    result = db.session.execute(
        "SELECT DISTINCT Title, PlaylistID, Description, DateCreated FROM Playlist NATURAL JOIN Tags WHERE TagName LIKE '%{0}%' OR Title LIKE '%{0}%' OR Description LIKE '%{0}%'".format(query)
    )
    playlists_list = []
    items = [dict(row) for row in result.fetchall()]
    for playlist in items:
        playlists_list.append(
            {
                "Title": playlist["Title"],
                "PlaylistID": playlist["PlaylistID"],
                "Description": playlist["Description"],
                "DateCreated": playlist["DateCreated"],
            }
        )
    return send_response(status=200, data={"SearchResults": playlists_list})


#update playlist description
@playlists.route('/update-playlist/<playlistID>', methods=['PUT'])
def update_playlist(playlistID):
    data = request.get_json()

    description = data.get('description')

    if not description:
        return send_response(status=400, message="Title or Description should be filled out.")

    if description:
        result = db.session.execute(
            '''UPDATE Playlist SET Description = :description WHERE PlaylistID = :playlistID''',
            {"description": description, "playlistID": playlistID}
        )
        db.session.commit()

    return send_response(status=200, message="Updated Playlist!")

# create a new playlist
@playlists.route('/delete-playlist/<userID>', methods=['DELETE'])
def delete_playlist(userID):
    data = request.get_json()

    title = data.get('title')

    # create unique playlistID identifier (userID-title)
    id_title = title.replace(" ", "-")
    playlistID = userID+'-'+id_title


    try:
        # create the playlist
        result = db.session.execute(
            '''DELETE FROM Playlist WHERE PlaylistID = :playlistID''',
                {"playlistID": playlistID}
        )
        db.session.commit()
        return send_response(status=200, message="Playlist deleted!")
    except Exception as e:
        print(e)
        return send_response(status=500, message="Oops, something went wrong. Try again")


# get all songs in a certain playlist
@playlists.route('/get-songs/<playlistID>', methods=['GET'])
def get_song(playlistID):
    result = db.session.execute(
        "SELECT * FROM PlaylistEntry WHERE PlaylistID = :playlistID", {"playlistID": playlistID}
    )
    songs = []
    for song in result:
        songs.append(
            {
                "SongID": song.SongID,
                "SongTitle": song.SongTitle,
                "Source": song.Source,
                "SongURL": song.SongURL
            }
        )
    return send_response(status=200, data={"Songs": songs})

# add new song to playlist
@playlists.route('/add-song/<playlistID>', methods=['POST'])
def add_song(playlistID):
    data = request.get_json()


    #songID = data.get('songID')
    songTitle = data.get('songTitle')

    # For spotify this will be the URI (format = spotify:track:spotifyID)
    songURL = data.get('songURL')
    source = data.get('source')

    # Creating SongID here in the form of playlistID-songURL
    songID = playlistID+'-'+songURL

    # check if song already exists
    if not get_songs_helper(playlistID, songURL):
        return send_response(status=409, message="Song already added!")

    try:
        result = db.session.execute(
            '''INSERT INTO PlaylistEntry (SongID, PlaylistID, SongTitle, Source,
                SongURL)
                VALUES (:songID, :playlistID, :songTitle, :source,
                    :songURL)''',
                {"songID": songID, "playlistID": playlistID, "songTitle": songTitle, "source": source,
                 "songURL": songURL}
        )
        db.session.commit()
        return send_response(status=200, message="Added song successfully!")

    except Exception as e:
        print(e)
        return send_response(status=500, message="Oops, something went wrong. Try again")

# get all songs from a playlist (inner function)
def get_songs_helper(playlistID, songURL_to_add):
    result = db.session.execute(
        "SELECT * FROM PlaylistEntry WHERE PlaylistID = :playlistID", {"playlistID": playlistID}
    )
    for song in result:
        if song.SongURL == songURL_to_add:
            return False
    return True

# delete a song from a playlist
@playlists.route('/delete-song/<playlistID>/<songID>', methods=['DELETE'])
def delete_song(playlistID, songID):
    try:
        # create the playlist
        result = db.session.execute(
            '''DELETE FROM PlaylistEntry WHERE PlaylistID = :playlistID
                AND SongID = :songID''',
                {"playlistID": playlistID, "songID": songID}
        )
        db.session.commit()
        return send_response(status=200, message="Song deleted from playlist!")
    except Exception as e:
        print(e)
        return send_response(status=500, message="Oops, something went wrong. Try again")

# get all tags 
@playlists.route('/all-tags', methods=['GET'])
def all_tags():
    result = db.session.execute(
        "SELECT DISTINCT TagName FROM Tags ORDER BY TagName ASC"
    )
    tags = []
    items = [dict(row) for row in result.fetchall()]

    for tag in items:
        tags.append(tag["TagName"])
    
    return send_response(status=200, data={"Tags": tags})


# retrieve all tags from a playlist
@playlists.route('/get-tags/<playlistID>', methods=['GET'])
def get_tags(playlistID):
    result = db.session.execute(
        "SELECT * FROM Tags WHERE PlaylistID = :playlistID",
        {"playlistID": playlistID}
    )
    tag_list = []
    for tags in result:
        tag_list.append(
            {
                "TagName": tags.TagName
            }
        )

    return send_response(status=200, data={"Playlists": tag_list})


# add tag to playlist
@playlists.route('/add-tag/<playlistID>', methods=['POST'])
def add_tags(playlistID):
    data = request.get_json()
    tag = data.get('tag')
    # check if the tag exists already with the playlist
    result = db.session.execute(
        "SELECT * FROM Tags WHERE PlaylistID = :playlistID",
        {"playlistID": playlistID}
    )

    for existing_tag in result:
        print(tag, existing_tag)
        if existing_tag.TagName.lower() == tag.lower():
            return send_response(status=409, message="You already added this tag to this playlist!")

    try:
        result = db.session.execute(
            '''INSERT INTO Tags (TagName, PlaylistID)
                VALUES (:tagName, :playlistID)''',
                {"tagName": tag, "playlistID": playlistID}
        )
        db.session.commit()
    except Exception as e:
        return send_response(status=500, message="Oops, somethin went wrong")

    return send_response(status=200, message="Tag added successfully!")

# delete tag from playlist
@playlists.route('/delete-tag/<playlistID>', methods=['DELETE'])
def delete_tags(playlistID):
    data = request.get_json()

    tag = data.get('tag')
    try:
        result = db.session.execute(
            '''DELETE FROM Tags WHERE PlaylistID = :playlistID AND TagName = :tagName''',
            {"playlistID": playlistID, "tagName": tag}

        )

        db.session.commit()
        return send_response(status=200, message="Playlist tag deleted!")
    except Exception as e:
        print(e)
        return send_response(status=500, message="oops, something went wrong.")

# update playlist listen count (CALL WHEN ONCLICK TO A PLAYLIST)
@playlists.route('/update-playlist-count', methods=['PUT'])
def update_playlist_count():
    data = request.get_json()

    playlistID = data.get('playlistID')

    # up counter by 1
    try:
        result = db.session.execute(
            '''UPDATE Playlist SET PlaylistCount = PlaylistCount + 1 WHERE PlaylistID = :playlistID''',
            {"playlistID": playlistID}
        )
        db.session.commit()

    except Exception as e:
        print(e)
        return send_response(status=500, message="Oops, something went wrong. Try again")

    return send_response(status=200)


# advanced function 1 stuff

# creating random playlist
@playlists.route('/random-playlist/<tag>/<userID>', methods=['POST', 'GET'])
def create_random_playlist(tag, userID):

    # create the playlist
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    # create unique playlistID identifier
    # important! format = (userID-title), where spaces in original title are
    id_title = title.replace(" ", "-")
    playlistID = userID+'-'+id_title

    # get current date
    # format = Month-Day-YYYY
    today = date.today()
    dateCreated = today.strftime("%b-%d-%Y")

    if not title:
        return send_response(status=400, message="Title for your playlist is required")

    songs = []

    result = db.session.execute(
        "SELECT PlaylistID From Playlist WHERE PlaylistID = :playlistID",
        {"playlistID": playlistID}
    )
    result = result.fetchone()
    if result is None:
        try:
            # create the playlist
            result = db.session.execute(
                '''INSERT INTO Playlist (PlaylistID, UserID, Title, Description, DateCreated)
                    VALUES (:playlistID, :userID, :title, :description, :dateCreated)''',
                    {"playlistID": playlistID, "userID": userID, "title": title, "description": description,
                    "dateCreated": dateCreated}
            )
            db.session.commit()
        except Exception as e:
            print(e)
            return send_response(status=500, message="Oops, something went wrong. Try again")
    else:
        return send_response(status=409, message="You already have a playlist with this title, choose another name!")


    engine = create_engine(url)
    connection = engine.raw_connection()
    cursor = connection.cursor()

    cursor.callproc('Generate_Playlist', [tag, playlistID])

    cursor.close()
    connection.commit()
    connection.close()



    # get songs from the top 3 most popular playlists attributed to the tag

    engine = create_engine(url)
    connection = engine.raw_connection()
    cursor = connection.cursor()
    cursor.callproc('Popular_Playlist_Songs', [tag, playlistID])

    cursor.close()
    connection.commit()
    connection.close()

    result = db.session.execute(
        "SELECT * FROM PlaylistEntry WHERE PlaylistID = :playlistID", {"playlistID": playlistID}
    )
    for song in result:
        songs.append(
            {
                "SongID": song.SongID,
                "SongTitle": song.SongTitle,
                "Source": song.Source,
                "SongURL": song.SongURL
            }
        )
    return send_response(status=200, message="Your new playlist has been generated!", data={"Songs": songs})
