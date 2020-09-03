
from flask import Blueprint, jsonify
from app.data_handler import storage_util

api = Blueprint('api', __name__, url_prefix='/api/v1')


@api.route('/')
def api_home():
    return jsonify("Hello World! Documentation soon(tm)")


@api.route('/<resource_type>/<resource>')
@api.route('/<resource>')
def request_resource(resource_type=None, resource=None):
    if resource_type:
        obj = storage_util.request_json(resource_type, resource)
    else:
        obj = storage_util.request_json(resource)
    if obj:
        return jsonify(obj)
    return jsonify(error="Resource could not be found"), 404
