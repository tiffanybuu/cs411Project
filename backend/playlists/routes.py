from datetime import date
from flask import Blueprint, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from cs411 import db
from cs411.backend.response import send_response

playlists = Blueprint('playlists', __name__)

# create a new playlist 
@playlists.route('/new-playlist/<userID>', methods=['POST'])
def new_playlist(userID):
    data = request.get_json()
    print(data)
    
    # userID = data.get('userID')
    title = data.get('title')
    description = data.get('description')

    # create unique playlistID identifier 
    # important! format = (userID-title), where spaces in original title are 
    # replaced with '-'
    id_title = title.replace(" ", "-")
    playlistID = userID+'-'+id_title
    duration = 0 

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
                '''INSERT INTO Playlist (PlaylistID, UserID, Title, Description, DateCreated, Duration)
                    VALUES (:playlistID, :userID, :title, :description, :dateCreated, :duration)''',
                    {"playlistID": playlistID, "userID": userID, "title": title, "description": description,
                    "dateCreated": dateCreated, "duration": duration}
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
                "Duration": playlist.Duration
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
                "Duration": playlist.Duration
            }
        ) 
    return send_response(status=200, data={"Playlists": playlists_list})

# search for playlists from a given query 
@playlists.route('/search-playlists/<query>', methods=['GET']) 
def search_playlist(query):
    result = db.session.execute(
        "SELECT * FROM Playlist WHERE Title LIKE '%{0}%' OR Description LIKE '%{0}%'"
        .format(query)
    )
    playlists_list = []
    for playlist in result:
        playlists_list.append(
            {
                "Title": playlist.Title,
                "PlaylistID": playlist.PlaylistID,
                "Description": playlist.Description,
                "DateCreated": playlist.DateCreated,
                "Duration": playlist.Duration
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
                "SongDuration": song.SongDuration,
                "Position": song.Position,
                "SongURL": song.SongURL
            }
        )
    return send_response(status=200, data={"Songs": songs})

# add new song to playlist 
@playlists.route('/add-song/<playlistID>', methods=['POST'])
def add_song(playlistID):
    data = request.get_json() 

    # better to create this id in the frontend, maybe format userID-songURL 
    songID = data.get('songID')
    songTitle = data.get('songTitle')

    # For spotify this will be the URI (format = spotify:track:spotifyID)
    songURL = data.get('songURL')
    source = data.get('source')

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
