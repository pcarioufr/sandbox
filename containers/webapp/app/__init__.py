
from flask import Flask

from .log import log


app = Flask(__name__)


def create_app():

    app = Flask(__name__,
                instance_relative_config=False,
                template_folder='/webapp/pages')
    app.config.from_object('config.Config')


    with app.app_context():

        from .routes import test # test page to display tiled map
        from .routes import health # test page to display tiled map

        return app
