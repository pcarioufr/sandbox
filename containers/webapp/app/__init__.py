
from flask import Flask
from flask_redis import FlaskRedis

from .log import log

app = Flask(__name__)
redis_store = FlaskRedis(config_prefix="REDIS_STORE")


def create_app():

    app = Flask(__name__,
                instance_relative_config=False,
                static_url_path='/static',
                static_folder='./static',
                template_folder='./templates')
    app.config.from_object('app.config.Config')

    redis_store.init_app(app)

    with app.app_context():

        from .routes import home
        from .routes import health
        from .routes import after

        return app
