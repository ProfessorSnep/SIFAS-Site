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
    file_path = '%s.json' % ('/'.join(loc))
    blob = storage_bucket.get_blob(file_path)
    return json.loads(blob.download_as_string())


@app.route('/')
def home():
    return jsonify(["Hello World!", app.env, app.config['USE_LOCAL_DATA']])


@app.route('/test/')
def test():
    return jsonify(json_data('testing', 'test'))


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5001, debug=True)
