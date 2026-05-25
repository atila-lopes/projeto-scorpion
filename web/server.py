from flask import Flask
from flask import request
from flask import send_from_directory

app = Flask(__name__)

@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/script.js")
def script():
    return send_from_directory(".", "script.js")

@app.route("/command", methods=["POST"])
def command():

    data = request.get_json()

    cmd = data["command"]

    with open(
        "../worlds/command.txt",
        "w"
    ) as f:
        f.write(cmd)

    print("Comando recebido:", cmd)

    return {"status": "ok"}

app.run(
    host="0.0.0.0",
    port=5000,
    debug=True
)