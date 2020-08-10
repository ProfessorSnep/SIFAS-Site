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


@app.route('/cards/')
def card_list():
    return render_template('pages/card_list.html')


@app.route('/events/')
def event_list():
    return render_template('pages/event_list.html')


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


def template_member_info(member_id):
    member_info = request_api('members/all')
    return member_info[str(member_id)]


def template_member_icon_url(member_id):
    return content_endpoint(f'm/{member_id}.png')


def template_event_banner_url(event_banner_loc):
    return content_endpoint(f'eb/{event_banner_loc}')


def template_attrib_info():
    return request_api('attributes')


def template_card_info(card_id):
    return request_api('cards/all')[str(card_id)]


def template_card_list():
    card_list = request_api('cards/all')
    key_list = list(card_list.keys())
    key_list.sort(key=lambda x: card_list[x]['no'])
    return key_list


def template_event_list(include_minis=False):
    event_list = request_api('events')
    if not include_minis:
        event_list = list(
            filter(lambda e: e['type'] in ['pickup_gacha', 'fes_gacha', 'token_event', 'point_event'], event_list))
    return event_list


def template_card_latest():
    return request_api('cards/latest')


@app.template_filter('skill_short')
def filter_skill_short(skill):
    efs = []
    for effect in skill['effects']:
        efs.append(effect['short_display'])
    return '\n\n'.join(efs)


@app.template_filter('skill')
def filter_skill(skill):
    efs = []
    for effect in skill['effects']:
        effect_format = effect['effect_format']

        format_type = None

        def format_val(val):
            if format_type == 'percent':
                return '{0:.5g}%'.format(val*100)
            else:
                return str(val)

        def filter_vals(l):
            s = set()
            sa = s.add
            l2 = [x for x in l if not (x in s or sa(x))]
            return l if len(l2) > 1 else l2

        s_effect_vals = filter_vals(effect['effect_values'])
        s_until_vals = filter_vals(effect['until_values'])

        s_trigger_vals = filter_vals(effect['trigger_values'])
        s_trigger_chances = filter_vals(effect['trigger_chances'])

        format_type = effect['effect_value_type']
        effect_vals = '/'.join(map(format_val, s_effect_vals))
        format_type = effect['until_value_type']
        until_vals = '/'.join(map(format_val, s_until_vals))

        if len(s_effect_vals) > 1:
            effect_vals = '[%s]' % effect_vals
        if len(s_until_vals) > 1:
            until_vals = '[%s]' % until_vals

        effect_str = effect_format.format(
            effect=effect_vals, until=until_vals)

        trigger_format = effect['trigger_format']
        if trigger_format:
            format_type = effect['trigger_value_type']
            trigger_vals = '/'.join(map(format_val, s_trigger_vals))
            format_type = 'percent'
            trigger_chances = '/'.join(map(format_val, s_trigger_chances))

            if len(s_trigger_vals) > 1:
                trigger_vals = '[%s]' % trigger_vals
            if len(s_trigger_chances) > 1:
                trigger_chances = '[%s]' % trigger_chances

            trigger_str = trigger_format.format(
                trigger=trigger_vals, trigger_chance=trigger_chances)
        else:
            trigger_str = None

        efs.append({
            'effect': effect_str,
            'trigger': trigger_str,
            'target': effect['target']
        })
    return efs


@app.template_filter('loc_name')
def filter_loc_name(obj, name='name', preferred='en'):
    vals = {'jp': '%s_jp' % name, 'en': '%s_en' % name}
    if preferred in vals.keys():
        v = vals[preferred]
        if v in obj and obj[v]:
            return obj[v]
    for _, v in vals.items():
        if v in obj and obj[v]:
            return obj[v]
    return None


app.jinja_env.globals.update(tex=template_tex_url)
app.jinja_env.globals.update(icon=template_ui_url)
app.jinja_env.globals.update(banner=template_event_banner_url)
app.jinja_env.globals.update(attributes=template_attrib_info)
app.jinja_env.globals.update(card_info=template_card_info)
app.jinja_env.globals.update(cards=template_card_list)
app.jinja_env.globals.update(events=template_event_list)
app.jinja_env.globals.update(latest_cards=template_card_latest)
app.jinja_env.globals.update(member_info=template_member_info)
app.jinja_env.globals.update(member_icon=template_member_icon_url)


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
