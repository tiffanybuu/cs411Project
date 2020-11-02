from datetime import date
from flask import Blueprint, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from cs411 import db
from cs411.backend.response import send_response

playlists = Blueprint('playlists', __name__)

# create a new playlist 
@playlists.route('/new-playlist', methods=['POST'])
def new_playlist():
    data = request.get_json()
    print(data)
    
    userID = data.get('userID')
    title = data.get('title')
    description = data.get('description')

    # create unique playlistID identifier (userID-title)
    playlistID = userID+'-'+title
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
                "Title": playlist.Title,
                "Description": playlist.Description,
                "DateCreated": playlist.DateCreated,
                "Duration": playlist.Duration
            }
        }
    )


# create a new playlist 
@playlists.route('/delete-playlist', methods=['DELETE'])
def delete_playlist():
    data = request.get_json()
    print(data)
    
    userID = data.get('userID')
    title = data.get('title')

    # create unique playlistID identifier (userID-title)
    playlistID = userID+'-'+title


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

