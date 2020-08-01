from flask import Flask, request, redirect, render_template
import requests
import json
import os

app = Flask(__name__, static_folder="static_base",
            static_url_path="", template_folder="templates")
app.url_map.strict_slashes = False
app.config.from_object(os.environ['CONFIG_SETTINGS'])


def api_endpoint(path):
    return '%s/%s' % (app.config['API_ENDPOINT'], path)


@app.route('/')
def home():
    return "Hello world!"


@app.route('/test')
def api_test():
    data = requests.get(api_endpoint('test'))
    return data.content


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
