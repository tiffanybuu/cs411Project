from flask import Blueprint, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from cs411Project import db
from ...db.db import graph_db
from cs411Project.backend.response import send_response
# from cs411Project.templates.nexjs.pages import index.js
users = Blueprint('users', __name__)

# define main page for login
@users.route('/')
def index():
    return render_template('index.html')


# signup page
@users.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    firstName = data.get('first_name')
    lastName = data.get('last_name')
    username = data.get('username')
    password = data.get('password')


    if not username or not password:
        # 400 error, need username or password
        return send_response(status=400, message="Username and Password is required")


    # first check if the user exists
    result = db.session.execute(
        "SELECT userID FROM User_Account WHERE userID = :username", {"username": username}
    )
    result = result.fetchone()
    if result is None:
        # we can now add this userzz
        try:
            result = db.session.execute(
                '''INSERT INTO User_Account (UserID, Password, FirstName, LastName, FollowingCount, FollowerCount)
                    VALUES (:username, :password, :firstName, :lastName, :following, :follower)''',
                    {"username": username, "password": password, "firstName": firstName, "lastName": lastName, "following": 0, "follower": 0}
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
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return send_response(status=400, message="Username and Password is required")

    result = db.session.execute(
        "SELECT * FROM User_Account WHERE userID = :username", {"username": username}
    )
    user = result.fetchone()

    if not user:
        return send_response(status=400, message="Username not found")

    elif user.Password != password:
        return send_response(status=401, message="Password incorrect. Try again")
    else:
        return send_response(status=200, data={"username": user.UserID,
            "FirstName": user.FirstName, "LastName": user.LastName,
            "FollowingCount": user.FollowingCount, "FollowerCount": user.FollowerCount})

@users.route('/get-user-info/<userID>', methods=['GET'])
def get_user_info(userID):
    result = db.session.execute(
        "SELECT * FROM User_Account WHERE UserID =:username",
        {'username': userID}
    )

    userInfo = dict(result.fetchone())
    return send_response(status=200, data={"UserInfo": userInfo})

# advanced function 2 stuff
@users.route('/follow', methods=['PUT'])
def follow_user():
    # {"curr": int, "follow": int}
    data = request.get_json()
    current_user: int = data['curr']
    follow: int = data['follow']
    with graph_db.session() as session:
        # lazily add users to graph and then add relationship
        session.run(f"""
            MERGE (u:User {{id: {current_user}}})
            MERGE (f:User {{id: {follow}}})
            MERGE (u)-[r:FOLLOWS]->(f)
        """)
    return send_response(status=200)

@users.route('/unfollow', methods=['PUT'])
def unfollow_user():
    # {"curr": str, "follow": str}
    data = request.get_json()
    current_user: str = data['curr']
    follow: str = data['follow']
    with graph_db.session() as session:
        session.run(f"""
            MATCH (u:User {{id: {current_user}}})-[r:FOLLOWS]->(f:User {{id: {follow}}})
            DELETE r
        """)
    return send_response(status=200)

@users.route('/transitive-recommend', methods=['GET'])
def get_transitive_recommendations():
    # {"curr": str}
    data = request.get_json()
    current_user: str = data.get('curr')
    users = []
    with graph_db.session() as session:
        result = session.run(f"""
            MATCH (a:User {{ id:{current_user} }})-[:FOLLOWS]->(:User)-[:FOLLOWS]->(b:User)
            WHERE b.id <> a.id
            RETURN b.id AS id
        """)
        for record in result:
            users.append(record['id'])
    return send_response(status=200, data={'users': users})

@users.route('/mutual-recommend', methods=['GET'])
def get_mutual_recommendations():
    # {"curr": str}
    data = request.get_json()
    current_user: str = data.get('curr')
    users = []
    with graph_db.session() as session:
        result = session.run(f"""
            MATCH (a:User {{ id:{current_user} }})-[:FOLLOWS]->(:User)<-[:FOLLOWS]-(b:User)
            WHERE b.id <> a.id
            RETURN b.id AS id
        """)
        for record in result:
            users.append(record['id'])
    return send_response(status=200, data={'users': users})