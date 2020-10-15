from flask import Blueprint, render_template, request


users = Blueprint('users', __name__)

# define main page for login 
@users.route('/')
def index(): 
    return render_template('index.html')


# signup page
@users.route('/signup', methods=['POST'])
def signup():
    firstName = request.form['first name']
    lastName = request.form['last name']

    # sql, insert into 
    return


# login page 
@users.route('/login', methods=["POST"])
def login():
    body = request.get_json()

    # sql, select * From User_Account WHERE UserId = UserId 
