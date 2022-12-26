
from flask import current_app as app
from flask import render_template, jsonify, Response, request
from flask import send_from_directory, send_file

from app import log
from app import redis_store

from ddtrace import tracer
import io
import qrcode


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

    return render_template(
        "home.jinja", 
        clientToken=app.config["DD_CLIENT_TOKEN"],
        applicationId=app.config["DD_APPLICATION_ID"],
        dd_version=app.config["DD_VERSION"]
        )


@app.route('/health', methods=['GET'])
def health():

    log.info("health")
    return jsonify(response="pong")


@app.route('/qrcode', methods=['GET'])
def qr_code():

    link = request.args.get("link")
    if link is None:
        return jsonify(), 400

    
    # https://pypi.org/project/qrcode/#description

    qr = qrcode.QRCode( 
                box_size=12,
                error_correction=qrcode.constants.ERROR_CORRECT_M
        )
    qr.add_data(link)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#ece2ce", back_color="#0c6f50")
    img.convert('RGB')

    img_io = io.BytesIO()
    img.get_image().save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')


@app.after_request
def after(response):

    log.debug("endpoint = {}".format(request.endpoint))

    # https://flask.palletsprojects.com/en/2.2.x/tutorial/static
    # no Cache header in flask static default routines

    if request.endpoint == "static":   
        response.headers['Cache-Control'] = 'max-age=30'
        log.warning("flask serving satic {}".format(request.path))

    elif request.endpoint == "qr_code": 
        response.headers['Cache-Control'] = 'max-age=30'

    return response
