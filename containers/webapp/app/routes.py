
from flask import current_app as app
from flask import render_template, jsonify, Response, request

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



@app.route('/health', methods=['GET'])
def health():

    log.info("health")
    return jsonify(response="pong")


@app.route('/test', methods=['GET'])
def test():

    log.info("test")
    return render_template("test.html", title="Super Title")

