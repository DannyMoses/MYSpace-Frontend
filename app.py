from flask import Flask, request, session, render_template
import requests
import json

from config import config

app = Flask(__name__)

logins_route = config["logins_route"]
posts_route = config["posts_route"]

@app.route("/adduser", methods=["POST"])
def adduser():
	content = request.json
	r = requests.post(url = (logins_route + "/adduser"), data=content)

	data = r.json()

	return data, 200

@app.route("/login", methods=["POST"])
def login():
	content = request.json
	r = requests.post(url = (logins_route + "/login"), data=content)

	data = r.json()

	if data["status"] == "OK":
		session["user"] = content["username"]

	return data, 200

@app.route("/logout", methods=["POST"])
def logout():
	session.clear()

	return { "status" : "OK" }, 200

@app.route("/verify", methods=["POST"])
def verify():
	content = request.json
	r = requests.post( url = (logins_route + "/verify"), data=content)

	data = r.json()

	return data, 200

@app.route("/additem", methods=["POST"])
def additem():
	if "user" not in session:
		print("NO ONE LOGGED IN")
		return { "status" : "ERROR", "message" : "not logged in" }, 200 #400

	content = request.json
	content["user"] = session["user"]
	r = requests.post( url = (posts_route + "/additem"), data=content)

	data = r.json()

	return data, 200

@app.route("/item/<id>", methods=["GET"])
def getitem(id):
	if "user" not in session:
		print("NO ONE LOGGED IN")
		return { "status" : "ERROR", "message" : "not logged in" }, 200 #400

	params = {"id" : id }

	r = requests.get(url = (posts_route + "/item"), params=params)

	data = r.json()

	return data, 200

@app.route("/search", methods=["POST"])
def search():
	if "user" not in session:
		print("NO ONE LOGGED IN")
		return { "status" : "ERROR", "message" : "not logged in" }, 200 #400

	contents = request.json
	r = requests.post(url = (posts_route + "/search"), data=content)

	data = r.json()

	return data, 200
	content = request.json
	r = requests.post(url = (posts_route + "/search"), data=content)

	data = r.json()

	return data, 200
