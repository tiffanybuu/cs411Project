from flask import Blueprint, render_template, request
from __init__ import db
from response import send_response

users = Blueprint('users', __name__)

# define main page for login 
@users.route('/')
def index(): 
    return render_template('index.html')


# signup page
@users.route('/signup', methods=['POST'])
def signup():
    # form input should be the same as here
    firstName = request.form['first_name']
    lastName = request.form['last_name']
    username = request.form['username']
    password = request.form['password']

    if not username or not password:
        # 400 error, need username or password
        return send_response(status=400, message="Username and Password is required")


    # first check if the user exists 
    result = db.session.execute(
        "SELECT TOP 1 FROM User_Account WHERE userID = :username", {"username": username}
    )
    if result is None:
        # we can now add this user 
        try:
            result = db.session.execute(
                '''INSERT INTO User_Account (UserID, Password, FirstName, LastName, FollowingCount, FollowerCount)
                    VALUES (:username, :password, :firstName, :lastName)''',
                    {"username": username, "password": password, "firstName": firstName, "lastName": lastName}
            )
            db.session.commit()
        except Exception as e:
            return send_response(status=500, message="Oops, something went wrong. Try again")
    else:
        return send_response(status=409, message="Username already exists! Pick another one")
    
    result = db.session.execute(
        "SELECT UserID FROM User_Account WHERE UserID = :username", {"username": username}
    )

    new_user = result.fetchone()

    return send_response(status=200, data={"UserID": new_user.UserID}) 


# login page 
@users.route('/login', methods=["POST"])
def login():
    body = request.get_json()

    # sql, select * From User_Account WHERE UserId = UserId 