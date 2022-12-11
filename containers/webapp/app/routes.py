
from flask import current_app as app
from flask import render_template, jsonify, Response

from app import log

@app.route('/ping', methods=['GET'])
def health():

    log.info("ping")
    return jsonify(response="pong")


@app.route('/test', methods=['GET'])
def test():

    log.info("test")
    return render_template("test.html", host=app.config["HOST"])

