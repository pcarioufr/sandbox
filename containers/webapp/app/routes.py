
from flask import current_app as app
from flask import render_template, jsonify, Response, request
from flask import send_from_directory, send_file

from app import log
from app import redis_store

from ddtrace import tracer
import io
import qrcode


@app.route('/', methods=['GET'])
def home():

    return render_template(
        "home.jinja", 
        clientToken=app.config["DD_CLIENT_TOKEN"],
        applicationId=app.config["DD_APPLICATION_ID"],
        dd_version=app.config["DD_VERSION"],
        dd_env=app.config["DD_ENV"]
        )


@app.route('/health', methods=['GET'])
def health():

    log.debug("health check ok")
    return jsonify(), 204


@app.route('/qrcode', methods=['GET'])
def qr_code():

    link = request.args.get("link")
    if link is None:
        return jsonify(), 400

    ## Generates the QRCode ##### ##### ##### #####
    
    # https://pypi.org/project/qrcode/#description
    qr = qrcode.QRCode( 
                box_size=12,
                error_correction=qrcode.constants.ERROR_CORRECT_M
        )
    qr.add_data(link)

    with tracer.trace("qrcode.make"):
        qr.make(fit=True)

    with tracer.trace("qrcode.image.make"):
        img = qr.make_image(fill_color="#ece2ce", back_color="#0c6f50")
    with tracer.trace("qrcode.image.convert"):
        img.convert('RGB')

    with tracer.trace("qrcode.image.save"):
        img_io = io.BytesIO()
        img.get_image().save(img_io, 'PNG')

    img_io.seek(0)
    response = send_file(img_io, mimetype='image/png')

    ## Some sanboxy statistics ##### ##### ##### #####

    # keeps track of how often this QRCode has been generated
    redis_store.incr(link, 1)

    # and returns the value as response header 
    try:
        count = redis_store.get(link).decode("utf-8")
    except Exception as e:
        log.info("{}".format(e))
        count = 0

    response.headers['X-Sandbox-Count'] = count

    return response


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
