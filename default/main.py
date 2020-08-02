from flask import Flask, request, redirect, render_template
import requests
import json
import os

app = Flask(__name__, static_folder="static",
            static_url_path="", template_folder="templates")
app.url_map.strict_slashes = False
app.config.from_object(os.environ['CONFIG_SETTINGS'])


def api_endpoint(path):
    return '%s/%s' % (app.config['API_ENDPOINT'], path)


def content_endpoint(path):
    return '%s/%s' % (app.config['CONTENT_ENDPOINT'], path)


request_cache = {}


def request_api(path, cacheable=True):
    if cacheable and path in request_cache:
        return request_cache[path]
    req_url = api_endpoint(path)
    req = requests.get(req_url)
    response = req.json()
    if cacheable:
        request_cache[path] = response
    return response


@app.route('/')
def home():
    return render_template('pages/home.html')


@app.route('/test/')
def test():
    return render_template('pages/test.html')


def template_tex_url(path):
    image_map = request_api('images')
    if path in image_map:
        return content_endpoint(image_map[path])
    return ''


app.jinja_env.globals.update(tex=template_tex_url)


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
