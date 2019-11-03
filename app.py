from flask import Flask, request, session, redirect, url_for, render_template, jsonify
import requests
import json

from config import config

app = Flask(__name__)

logins_route = config["logins_route"]
posts_route = config["posts_route"]
http = "http://"

app.config["SECRET_KEY"] = "fatyoshi"

### Webpage ###
@app.route("/")
def redirect_home():
	return redirect(url_for('home'))

@app.route("/home")
def home():
	user = None
	if 'user' in session:
		user = session['user']
	return render_template("home.html", username=user)

### Endpoints ###
@app.route("/reset", methods=["POST"])
def reset_db():
	requests.post(url = (http + logins_route + "/reset_logins"))
	requests.post(url = (http + posts_route + "/reset_posts"))
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

	if 'username' in session:
		return { "status" : "OK", "username": session['username']}, 200
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

## Posts ##
@app.route("/additem", methods=["POST"])
def additem():
	print("session", str(session))
	if "user" not in session:
		print("NO ONE LOGGED IN")
		return jsonify({ "status" : "ERROR", "error" : "Not logged in" }), 200 #400

	content = request.json
	content["user"] = session["user"]
	content["childType"] = "null" # TODO: Add replies and retweets
	r = requests.post( url = (http + posts_route + "/additem"), json=content)

	data = r.json()

	return jsonify(data), r.status_code

@app.route("/item/<id>", methods=["GET"])
def getitem(id):
	params = {"id" : id }

	r = requests.get(url = (http + posts_route + "/item"), params=params)

	data = r.json()

	return jsonify(data), r.status_code

@app.route("/item/<id>", methods=["DELETE"])
def deleteitem(id):
	params = {"id" : id }

	r = requests.delete(url = (http + posts_route + "/item"), params=params)

	data = r.json()

	return jsonify(data), r.status_code

@app.route("/search", methods=["POST"])
def search():
	content = request.json
	r = requests.post(url = (http + posts_route + "/search"), json=content)

	data = r.json()

	return jsonify(data), r.status_code

