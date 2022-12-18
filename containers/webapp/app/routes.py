
from flask import current_app as app
from flask import render_template, jsonify, Response, request
from flask import send_from_directory

from app import log

from ddtrace import tracer

from app import redis_store


@app.route('/ping/<bucket_id>', methods=['GET', 'POST'])
def ping(bucket_id=None):

    if bucket_id is None:
        return Response("oops",status=400)

    if request.method == 'POST':
        redis_store.incr(bucket_id, 1)
        redis_store.expire(bucket_id, 10)

    try:
        count = redis_store.get(bucket_id).decode("utf-8")
    except Exception as e:
        log.info("{}".format(e))
        count = 0

    return jsonify(id=bucket_id, count=count)


@app.route('/', methods=['GET'])
def home():

    log.info("test")
    return render_template("test.html", title="Super Title")


@app.route('/health', methods=['GET'])
def health():

    log.info("health")
    return jsonify(response="pong")


@app.after_request
def after(response):

    if request.endpoint == "static": 
        # https://flask.palletsprojects.com/en/2.2.x/tutorial/static
        # no Cache header in flask static default routines  
        response.headers['Cache-Control'] = 'max-age=30'
        log.warning("flask serving cache {}".format(request.path))

    return response
