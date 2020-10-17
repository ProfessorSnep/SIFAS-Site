
from flask import Blueprint, jsonify, request
from app import config
from app.data_handler import storage_util

api = Blueprint('api', __name__, url_prefix='/api/v1')


@api.route('/')
def api_home():
    return jsonify("Hello World! Documentation soon(tm)")


@api.route('/cacheclear')
def clear_cache():
    if 'key' in request.args:
        key_req = request.args['key']
        if key_req == config.current['CACHE_RESET_KEY']:
            storage_util.resource_cache = {}
            return jsonify(success="Cache reset successfully")
    return jsonify(error="Not Authorized."), 401


@api.route('/<resource_type>/<resource>/<addl_path>')
@api.route('/<resource_type>/<resource>')
@api.route('/<resource>')
def request_resource(resource_type=None, resource=None, addl_path=None):
    if addl_path:
        obj = storage_util.request_json(resource_type, resource, addl_path)
    elif resource_type:
        obj = storage_util.request_json(resource_type, resource)
    else:
        obj = storage_util.request_json(resource)
    if obj:
        return jsonify(obj)
    return jsonify(error="Resource could not be found"), 404
