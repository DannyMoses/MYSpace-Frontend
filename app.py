from flask import Flask, request, session, render_template, jsonify
import requests
import json

from config import config

app = Flask(__name__)

logins_route = config["logins_route"]
posts_route = config["posts_route"]
http = "http://"

app.config["SECRET_KEY"] = "fatyoshi"

#@app.route("/reset", methods=["POST"])
#def reset_db():
#	requests.post(url = (http + logins_route + "/reset"), json=content)
#	requests.post(url = (http + posts_route + "/reset"), json=content)
#	return { "status": "OK" }, 200

@app.route("/adduser", methods=["POST"])
def adduser():
	content = request.json
	print("CONTENT", content)
	r = requests.post(url = (http + logins_route + "/adduser"), json=content)

	data = r.json()
	print("DATA", data)
	return jsonify(data), 200

@app.route("/login", methods=["POST"])
def login():
	content = request.json
	print("content:", content)

	if 'username' in session:
		return { "status" : "OK" }, 200
	r = requests.post(url = (http + logins_route + "/login"), json=content)

	data = r.json()
	print("DATA:", data)
	if data["status"] == "OK":
		session["user"] = content["username"]
	return jsonify(data), 200

@app.route("/logout", methods=["POST"])
def logout():
	session.clear()

	return jsonify({ "status" : "OK" }), 200

@app.route("/verify", methods=["POST"])
def verify():
	content = request.json
	r = requests.post( url = (http + logins_route + "/verify"), json=content)

	data = r.json()

	return jsonify(data), 200

@app.route("/additem", methods=["POST"])
def additem():
	#print("session", str(session))
	if "user" not in session:
		print("NO ONE LOGGED IN")
		return jsonify({ "status" : "ERROR", "message" : "not logged in" }), 200 #400

	content = request.json
	content["user"] = session["user"]
	r = requests.post( url = (http + posts_route + "/additem"), json=content)

	data = r.json()

	return jsonify(data), 200

@app.route("/item/<id>", methods=["GET"])
def getitem(id):
	params = {"id" : id }

	r = requests.get(url = (http + posts_route + "/item"), params=params)

	data = r.json()

	return jsonify(data), 200

@app.route("/search", methods=["POST"])
def search():
	content = request.json
	r = requests.post(url = (http + posts_route + "/search"), json=content)

	data = r.json()

	return jsonify(data), 200

