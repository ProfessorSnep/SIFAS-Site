from flask import Flask, request, redirect, render_template, jsonify
from google.cloud import storage
import requests
import json
import os

app = Flask(__name__, static_folder="static_base",
            static_url_path="", template_folder="templates")
app.url_map.strict_slashes = False
app.config.from_object(os.environ['CONFIG_SETTINGS'])

storage_client = storage.Client()
storage_bucket = storage_client.get_bucket("sifas-site.appspot.com")


def json_data(*loc):
    if app.config['USE_LOCAL_DATA']:
        file_path = os.path.join(os.environ['JSON_BUCKET_PATH'], *loc)
        file_path = '%s.json' % (file_path)
        with open(file_path, 'r', encoding='utf-8') as inf:
            return json.load(inf)
    else:
        file_path = '%s.json' % ('/'.join(loc))
        blob = storage_bucket.get_blob(file_path)
        return json.loads(blob.download_as_string())


@app.route('/api/')
def home():
    return jsonify(["Hello World!", app.env, app.config['USE_LOCAL_DATA']])


@app.route('/api/card/<card_id>/')
def card_info(card_id):
    return jsonify(json_data('cards', card_id))


@app.route('/api/attributes/')
def attribute_info():
    return jsonify(json_data('attributes'))


@app.route('/api/icons/')
def icon_info():
    return jsonify(json_data('icons'))


@app.route('/api/images/')
def image_map():
    return jsonify(json_data('image_map'))


@app.errorhandler(404)
def not_found(*args):
    return jsonify({'error': "The endpoint you are requesting is not implemented"})


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5001, debug=True)
