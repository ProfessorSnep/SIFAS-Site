from flask import Flask
import os
from app.default import default, template_util
from app.api import api


def create_application():
    app = Flask(__name__)

    app.url_map.strict_slashes = False
    app.config.from_object(os.environ['CONFIG_SETTINGS'])

    app.register_blueprint(default)
    app.register_blueprint(api)

    template_util.add_globals(app)

    return app
