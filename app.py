from flask import Flask, request, session, redirect, url_for, render_template, jsonify
from werkzeug import secure_filename
import requests
import json

from config import config

app = Flask(__name__)

logins_route = config["logins_route"]
posts_route = config["posts_route"]
profiles_route = config["profiles_route"]
http = "http://"

app.config["SECRET_KEY"] = "fatyoshi"

### Webpage ###
@app.route("/")
def redirect_home():
	return redirect(url_for('home'))

@app.route("/home")
def home():
	welcome = "to Moses-Yang Space"
	if 'user' in session:
		welcome = session['user']
	return render_template("home.html", welcome_text=welcome)

@app.route("/profile", methods=["GET", "POST"])
def profile():
	content = request.form

	user = ""
	if 'user' in session and session['user'] != content['username']:
		user = session['user']

	print(content)
	print(user)

	return render_template("profile.html",
			username=content['username'],
			user=user,
			email=content['email'],
			num_followers=content['followers'],
			num_following=content['following'])


### Endpoints ###
@app.route("/reset", methods=["POST"])
def reset_db():
	requests.post(url = (http + logins_route + "/reset_logins"))
	requests.post(url = (http + posts_route + "/reset_posts"))
	requests.post(url = (http + profiles_route + "/reset_profiles"))
	return { "status": "OK" }, 200


## Logins ##
@app.route("/adduser", methods=["POST"])
def adduser():
	content = request.json
	print("CONTENT", content)
	r = requests.post(url = (http + logins_route + "/adduser"), json=content)

	data = r.json()
	print("DATA", data)
	return jsonify(data), r.status_code

@app.route("/login", methods=["POST"])
def login():
	content = request.json
	print("content:", content)

	if 'user' in session:
		return { "status" : "OK", "username": session['user']}, 200
	r = requests.post(url = (http + logins_route + "/login"), json=content)

	data = r.json()
	print("DATA:", data)
	if data["status"] == "OK":
		session["user"] = content["username"]
	return jsonify(data), r.status_code

@app.route("/logout", methods=["POST"])
def logout():
	session.clear()

	return jsonify({ "status" : "OK" }), 200

@app.route("/verify", methods=["POST"])
def verify():
	content = request.json
	r = requests.post( url = (http + logins_route + "/verify"), json=content)

	data = r.json()

	return jsonify(data), r.status_code


## Profiles ##
@app.route("/user/<username>", methods=["GET"])
def get_profile(username):
	content = { 'username': username }
	r = requests.get( url = (http + profiles_route + "/user"), json=content )

	data = r.json()
	return jsonify(data), r.status_code

@app.route("/user/<username>/posts", methods=["GET"])
def get_user_posts(username):
	content = request.args.to_dict()
	content['username'] = username
	print(content)
	if 'limit' in content:
		content['limit'] = int(content['limit'])
	r = requests.post( url = (http + profiles_route + "/user/posts"), json=content )

	data = r.json()
	return jsonify(data), r.status_code

@app.route("/user/<username>/followers", methods=["GET"])
def get_user_followers(username):
	content = request.args.to_dict()
	content['username'] = username
	if 'limit' in content:
		content['limit'] = int(content['limit'])
	r = requests.post( url = (http + profiles_route + "/user/followers"), json=content )

	data = r.json()
	return jsonify(data), r.status_code

@app.route("/user/<username>/following", methods=["GET"])
def get_user_following(username):
	content = request.args.to_dict()
	content['username'] = username
	if 'limit' in content:
		content['limit'] = int(content['limit'])
	r = requests.post(url = (http + profiles_route + "/user/following"), json=content)

	data = r.json()

	return jsonify(data), r.status_code

@app.route("/follow", methods=["POST"])
def set_follow():
	if "user" not in session:
		print("NO ONE LOGGED IN")
		return jsonify({ "status" : "ERROR", "error" : "Not logged in" }), 200 #400

	content = request.json
	content['user'] = session['user']
	print(content)
	r = requests.post(url = (http + profiles_route + "/follow"), json=content)

	data = r.json()

	return jsonify(data), r.status_code

@app.route("/follow", methods=["GET"])
def get_follow():
	if "user" not in session:
		print("NO ONE LOGGED IN")
		return jsonify({ "status" : "ERROR", "error" : "Not logged in" }), 200 #400

	content = request.args.to_dict()
	content['user'] = session['user']
	print(content)
	r = requests.get(url = (http + profiles_route + "/follow"), json=content)

	data = r.json()

	return jsonify(data), r.status_code


## Posts ##
@app.route("/additem", methods=["POST"])
def additem():
	if "user" not in session:
		print("NO ONE LOGGED IN")
		return jsonify({ "status" : "ERROR", "error" : "Not logged in" }), 200 #400

	content = request.json
	content["user"] = session["user"]
	r = requests.post( url = (http + posts_route + "/additem"), json=content)

	data = r.json()

	return jsonify(data), r.status_code

@app.route("/item/<id>", methods=["GET"])
def getitem(id):
	params = {"id" : id}

	r = requests.get(url = (http + posts_route + "/item"), params=params)

	data = r.json()

	return jsonify(data), r.status_code

@app.route("/item/<id>", methods=["DELETE"])
def deleteitem(id):
	if "user" not in session:
		print("NO ONE LOGGED IN")
		return jsonify({ "status" : "ERROR", "error" : "Not logged in" }), 403

	data = {"id" : id, "user": session['user']}
	r = requests.delete(url = (http + posts_route + "/item"), json=data)

	data = r.json()

	print(data)

	return jsonify(data), r.status_code

@app.route("/item/<id>/like", methods=["POST"])
def likeitem(id):
	if "user" not in session:
		print("NO ONE LOGGED IN")
		return jsonify({ "status" : "ERROR", "error" : "Not logged in" }), 200 # 400

	data = request.json
	data['id'] = id
	data['user'] = session['user']

	r = requests.post(url = (http + posts_route + "/item/like"), json=data)

	data = r.json()

	return jsonify(data), r.status_code

@app.route("/search", methods=["POST"])
def search():
	content = request.json
	print(content)

	if "user" in session:
		if 'following' not in content or content['following']:
			content['user'] = session['user']

	print(content)
	print(http + posts_route + "/search")

	r = requests.post(url = (http + posts_route + "/search"), json=content)

	print("request finished")

	data = r.json()

	return jsonify(data), r.status_code

@app.route("/addmedia", methods=["POST"])
def addmedia():
	print("/ADDMEDIA() CALLED")
	print("DATA", request.values)
	if "user" not in session:
		print("NO ONE LOGGED IN")
		return jsonify({ "status" : "error", "error" : "Not logged in" }), 200 # 400

	print('dict',request.files)
	print('content',request.files['content'])
	filename = secure_filename(request.files['content'].filename)
	mimetype = request.files['content'].content_type
	#r = requests.post(url = (http + posts_route + "/addmedia"), files={'content': (filename, request.files['content'], mimetype)})
	r = requests.post(url = (http + posts_route + "/addmedia"), files=request.files)

	print("request finished")
	
	data = r.json()

	print(data)

	return jsonify(data), r.status_code

@app.route("/media/<id>", methods=["GET"])
def getmedia(id):
	params = {"id" : id}

	r = requests.get(url = (http + posts_route + "/media"), params=params)

	print(r)
	#print(r.content)

	return r.content, r.status_code

