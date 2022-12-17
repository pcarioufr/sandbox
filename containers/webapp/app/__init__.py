
from flask import Flask
from flask_redis import FlaskRedis

from .log import log

app = Flask(__name__)
redis_store = FlaskRedis(config_prefix="REDIS_STORE")


def create_app():

    app = Flask(__name__,
                instance_relative_config=False,
                template_folder='/webapp/pages')
    app.config.from_object('config.Config')

    redis_store.init_app(app)

    with app.app_context():

        from .routes import test
        from .routes import ping
        from .routes import health

        return app
