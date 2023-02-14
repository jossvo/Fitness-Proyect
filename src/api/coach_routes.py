"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Coach, Workout, Exercise_Assign, Workout_User,Workout_Review,Coach_Review, Category, Workout_Categories, Exercise_Library, Exercise_Status
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token, get_jwt, JWTManager 
from flask_bcrypt import Bcrypt
from api.user_routes import check_email
from api.user_routes import upload_image
import secrets
import tempfile
import re

api_coach = Blueprint('apiCoach', __name__)
app = Flask(__name__)
crypto = Bcrypt(app)

@api_coach.route('/coach/login', methods=['POST'])
def coach_login():
    email = request.json.get('email')
    password = request.json.get('password')

    coach=Coach.query.filter(Coach.email==email).first()
    if coach is None:
        return jsonify({"status":"Wrong email","msg": "Couldn't find a Fit Central account associated with this email. Please try again"}), 401
        
    #Validar la clave
    if not crypto.check_password_hash(coach.password,password):
        return jsonify({"status":"Wrong password","msg": "That's not the right password. Please try again"}), 401

    token = create_access_token(identity=coach.id)
    refresh_token=create_refresh_token(identity=coach.id)
    return jsonify({"access_token":token,"refresh_token":refresh_token,"id":coach.id,"type":"c"})

@api_coach.route('/coach/signup', methods=['POST'])
def new_coach():
    msg = {}
    email = request.form.get('email').lower()
    username = request.form.get('username').lower()
    email_exists= Coach.query.filter(Coach.email==email).first()
    if email_exists is not None: 
        msg["email_msg"]="Email adress is already in use"
    username_exists= Coach.query.filter(Coach.username==username).first()
    if username_exists is not None: 
        msg["username_msg"]="Username is already in use"
    if email_exists is not None or username_exists is not None: 
        return jsonify(msg) , 409

    class_keys = ['first_name','last_name','email', 'password','birthday','gender',"username"]

    new_coach=Coach()
    for key in class_keys:
        if key == 'password':
            password = request.form.get('password')
            password = crypto.generate_password_hash(password).decode("utf-8")
            setattr(new_coach,key,password)
        elif isinstance(request.form.get(key), str): 
            setattr(new_coach,key,request.form.get(key).lower())
        else:setattr(new_coach,key,request.form.get(key))


    db.session.add(new_coach)
    db.session.flush()
    coach_id = new_coach.id
    seed = secrets.token_hex(nbytes=16)
    db.session.commit()

    return jsonify({"msg":"Coach created","id":coach_id,"seed":seed,"type":"coach"})

@api_coach.route('/setcoachprofilepic/<coach_id>',methods=['POST'])
def set_profile_pic(coach_id):
    file=request.files['file']
    extension = "jpg"
    filename="coach_profile_pics/"+str(coach_id)+"."+extension
    upload_image(filename,file,extension)

    coach=Coach.query.get(coach_id)
    setattr(coach,'profile_picture',filename)
    db.session.add(coach)
    db.session.commit()


    return jsonify({"msg":"Porfile picture set"})