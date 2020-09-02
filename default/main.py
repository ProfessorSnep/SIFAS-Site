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


@app.route('/card/<card_id>/')
def card_view(card_id):
    return render_template('pages/card_view.html', card_id=card_id)


@app.route('/live/<live_id>/')
def live_view(live_id):
    return render_template('pages/live_view.html', live_id=live_id)


@app.route('/cards/')
def card_list():
    return render_template('pages/card_list.html')


@app.route('/lives/')
def event_list():
    return render_template('pages/live_list.html')


@app.route('/events/')
def live_list():
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


def template_school_icon_url(school_id):
    simg = {
        '1': 'muse',
        '2': 'aqours',
        '3': 'niji',
        'muse': 'muse',
        'aqours': 'aqours',
        'niji': 'niji',
        'nijigasaki': 'niji'
    }[str(school_id)]
    return content_endpoint(f'm/{simg}.png')


def template_event_banner_url(event_banner_loc):
    return content_endpoint(f'eb/{event_banner_loc}')


def template_attrib_info():
    return request_api('attributes')


def template_card_info(card_id):
    card_obj = request_api('cards/all')[str(card_id)]
    card_obj['card_id'] = card_id
    return card_obj


def template_live_info(live_id):
    return request_api('lives/all')[str(live_id)]


def template_event_info(event_id):
    event_list = request_api('events')
    return next(e for e in event_list if e['event_id'] == event_id)


def template_card_list():
    card_list = request_api('cards/all')
    key_list = list(card_list.keys())
    key_list.sort(key=lambda x: card_list[x]['no'])
    return key_list


def template_set_list():
    set_list = request_api('cards/sets')
    return set_list


def template_get_card_set(cid):
    set_list = request_api('cards/sets')
    for s in set_list:
        for e in s['entries']:
            if e['card'] == str(cid):
                return s
    return None


def template_event_list(include_minis=False):
    event_list = request_api('events')
    if not include_minis:
        event_list = list(
            filter(lambda e: e['type'] in ['pickup_gacha', 'fes_gacha', 'marathon', 'mining'], event_list))
    return event_list


def template_live_list():
    live_list = request_api('lives/all')
    key_list = list(live_list.keys())
    return key_list


def template_all_card_skill_info():
    active_skids = []
    passive_skids = []
    all_cards = request_api('cards/all')
    for cid, card in all_cards.items():
        for skill in card['skills']['active']:
            for effect in skill['effects']:
                if effect['effect']['type'] in map(lambda x: x['id'], active_skids):
                    continue
                active_skids.append({
                    'id': effect['effect']['type'],
                    'display': effect['effect']['display_short']
                })
        for skill in card['skills']['passive']:
            for effect in skill['effects']:
                if effect['effect']['type'] in map(lambda x: x['id'], passive_skids):
                    continue
                passive_skids.append({
                    'id': effect['effect']['type'],
                    'display': effect['effect']['display_short']
                })

    active_skids.sort(key=lambda x: x['id'])
    passive_skids.sort(key=lambda x: x['id'])
    return {
        'active': active_skids,
        'passive': passive_skids
    }


def template_card_latest():
    return request_api('cards/latest')


@app.template_filter('skill_short')
def filter_skill_short(skill, split="\n"):
    efs = []
    for effect in skill['effects']:
        efs.append(effect['short_display'])
    return split.join(efs)


@app.template_filter('skill')
def filter_skill(skill, path='effects'):
    efs = []
    for effect in skill[path]:
        effect_format = effect['effect']['format']

        format_type = None

        # format a value based off format type
        def format_val(val):
            if format_type == 'percent':
                return '{0:.5g}%'.format(val*100)
            else:
                return str(val)

        # filter values to only be unique
        def filter_vals(l):
            s = set()
            sa = s.add
            l2 = [x for x in l if not (x in s or sa(x))]
            return l if len(l2) > 1 else l2

        # format effect string
        s_effect_vals = filter_vals(effect['effect']['values'])

        format_type = effect['effect']['value_type']
        effect_vals = '/'.join(map(format_val, s_effect_vals))
        if len(s_effect_vals) > 1:
            effect_vals = '[%s]' % effect_vals

        until_vals = ''
        # format effect until string if it exists
        if effect['effect']['until']:
            s_until_vals = filter_vals(effect['effect']['until']['values'])

            format_type = effect['effect']['until']['value_type']
            until_vals = '/'.join(map(format_val, s_until_vals))
            if len(s_until_vals) > 1:
                until_vals = '[%s]' % until_vals

        effect_str = effect_format.format(effect=effect_vals, until=until_vals)

        # format trigger string if it exists
        trigger_str = None
        if effect['trigger']:
            s_trigger_vals = filter_vals(effect['trigger']['values'])
            s_trigger_chances = filter_vals(effect['trigger']['chances'])

            format_type = effect['trigger']['value_type']
            trigger_vals = '/'.join(map(format_val, s_trigger_vals))
            format_type = 'percent'
            trigger_chances = '/'.join(map(format_val, s_trigger_chances))

            if len(s_trigger_vals) > 1:
                trigger_vals = '[%s]' % trigger_vals
            if len(s_trigger_chances) > 1:
                trigger_chances = '[%s]' % trigger_chances

            trigger_str = effect['trigger']['format'].format(
                trigger=trigger_vals, trigger_chance=trigger_chances)

        # format target string if it exists
        target_str = None
        if effect['target']:
            target_str = effect['target']['display']

        efs.append({
            'effect': effect_str,
            'trigger': trigger_str,
            'target': target_str
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


@app.template_filter('card_classes')
def filter_card_classes(card):
    classes = [
        f"card-member-{card['member_id']}",
        f"card-school-{int(card['member_id'] / 100 + 1)}",
        f"card-rarity-{card['rarity']}",
        f"card-attribute-{card['attribute']}",
        f"card-role-{card['role']}"
    ]
    if card['is_fes']:
        classes.append('card-fes')
    card_set = template_get_card_set(card['card_id'])
    if card_set:
        classes.append(f"card-set-{card_set['id']}")

    for skill in card['skills']['active']:
        for effect in skill['effects']:
            classes.append(f"card-active-{effect['effect']['type']}")
    for skill in card['skills']['passive']:
        for effect in skill['effects']:
            classes.append(f"card-passive-{effect['effect']['type']}")

    return classes


app.jinja_env.globals.update({
    'tex': template_tex_url,
    'icon': template_ui_url,
    'banner': template_event_banner_url,
    'attributes': template_attrib_info,
    'card_info': template_card_info,
    'live_info': template_live_info,
    'event_info': template_event_info,
    'cards': template_card_list,
    'lives': template_live_list,
    'events': template_event_list,
    'sets': template_set_list,
    'get_card_set': template_get_card_set,
    'latest_cards': template_card_latest,
    'member_info': template_member_info,
    'member_icon': template_member_icon_url,
    'school_icon': template_school_icon_url,
    'all_card_skill_info': template_all_card_skill_info
})


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
