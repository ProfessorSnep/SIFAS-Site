
from flask import Blueprint, jsonify
from app.data_handler import storage_util

api = Blueprint('api', __name__, url_prefix='/api/v1')


@api.route('/')
def api_home():
    return jsonify("Hello World! Documentation soon(tm)")


@api.route('/cards/<resource>', defaults={'resource_type': 'cards'})
@api.route('/members/<resource>', defaults={'resource_type': 'members'})
@api.route('/lives/<resource>', defaults={'resource_type': 'lives'})
@api.route('/attributes', defaults={'resource': 'attributes'})
@api.route('/events', defaults={'resource': 'events'})
@api.route('/icons', defaults={'resource': 'icons'})
@api.route('/images', defaults={'resource': 'image_map'})
def request_resource(resource_type=None, resource=None):
    if resource_type:
        return jsonify(storage_util.request_json(resource_type, resource))
    else:
        return jsonify(storage_util.request_json(resource))
