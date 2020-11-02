from flask import jsonify

def send_response(status, message={}, data={}):
    success = False
    if 200 <= status < 300:
        success = True
    response = {
        "success": success,
        "message": message,
        "data": data
    }
    
    return jsonify(response), status