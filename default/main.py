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


@app.route('/card/<card_id>/')
def card_view(card_id):
    return render_template('pages/card_view.html', card_id=card_id)


def template_tex_url(path):
    image_map = request_api('images')
    if path in image_map:
        return content_endpoint(image_map[path])
    return ''


def template_ui_url(resource):
    icon_map = request_api('icons')
    if resource in icon_map:
        return content_endpoint(icon_map[resource])
    return ''


def template_member_icon_url(member_id):
    return content_endpoint(f'm/{member_id}.png')


def template_attrib_info():
    return request_api('attributes')


def template_card_info(card_id):
    return request_api(f'cards/{card_id}')


def template_card_list(platform='jp'):
    card_list = request_api('cards/list')
    return card_list[platform]


app.jinja_env.globals.update(tex=template_tex_url)
app.jinja_env.globals.update(icon=template_ui_url)
app.jinja_env.globals.update(attributes=template_attrib_info)
app.jinja_env.globals.update(card_info=template_card_info)
app.jinja_env.globals.update(cards=template_card_list)
app.jinja_env.globals.update(member_icon=template_member_icon_url)


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
