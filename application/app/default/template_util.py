from datetime import datetime
from typing import Any, Dict

import pytz
from app.data_handler.storage_util import content_endpoint, get_resource, get_resource_from_key


def util_filter_to_unique(lst):
    s = set()
    sa = s.add
    l2 = [x for x in lst if not (x in s or sa(x))]
    return lst if len(l2) > 1 else l2


def template_tex_url(path):
    return content_endpoint(path)


def template_ui_url(resource):
    icon_map = get_resource('icons')
    if resource in icon_map:
        return content_endpoint(icon_map[resource])
    return ''


def template_member_info():
    member_info = get_resource('members/all')
    return member_info


def template_group_info():
    group_info = get_resource('members/groups')
    return group_info


def template_unit_info():
    unit_info = get_resource('members/units')
    return unit_info


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


def template_card_info(card_id):
    card_obj = get_resource_from_key('cards/all', card_id)
    return card_obj


def template_live_info(live_id):
    return get_resource_from_key('lives/all', live_id)


def template_difficulty_info(diff_id):
    return get_resource_from_key('difficulties/all', diff_id)


def template_tower_info(tower_id):
    return get_resource(f'tower/{tower_id}')


def template_accessory_info(acc_id):
    return get_resource_from_key('accessories/all', acc_id)


def template_event_info(event_id):
    event_list = get_resource('events')
    return next(e for e in event_list if e['event_id'] == event_id)


def template_card_list():
    card_list = get_resource('cards/all')
    key_list = list(card_list.keys())
    key_list.sort(key=lambda x: card_list[x]['no'])
    return key_list


def template_set_list():
    set_list = get_resource('cards/sets')
    return set_list


def template_accessory_list():
    acc_list = get_resource('accessories/all')
    key_list = list(acc_list.keys())
    key_list.sort(key=lambda x: acc_list[x]['no'])
    return key_list


def template_get_card_set(cid):
    set_list = get_resource('cards/sets')
    for s in set_list:
        for e in s['entries']:
            if e['card'] == str(cid):
                return s
    return None


def template_event_list(include_minis=False):
    event_list = get_resource('events')
    if not include_minis:
        event_list = list(
            filter(lambda e: e['type'] in ['pickup_gacha', 'fes_gacha', 'marathon', 'mining'], event_list))
    return event_list


def template_live_list():
    live_list = get_resource('lives/all')
    key_list = list(live_list.keys())
    key_list.sort(key=lambda x: live_list[x]['display_order'])
    return key_list


def template_story_directory(story_type=None):
    story_dir = get_resource('story/directory/%s' %
                             (story_type if story_type else 'all'))
    return story_dir


def template_script(script_path, region='jp'):
    script_obj = get_resource('story/%s/%s' % (region, script_path))
    return script_obj


def template_transcript(script_path, region='jp'):
    script_obj = get_resource('story/%s/%s' % (region, script_path))

    used_cmds = ['speak']
    transcript_cmds = [cmd for cmd in script_obj['commands']
                       if cmd['command'] in used_cmds]

    return transcript_cmds


def template_script_path_obj(script_path):
    script_path_objs = get_resource('story/path')
    if script_path in script_path_objs:
        return script_path_objs[script_path]
    return None


def template_find_member_by_story_name(story_name):
    member_list = get_resource('members/all')

    for member in member_list.values():
        if '・' in member['name_jp']:
            first_name_jp = member['name_jp'].split('・')[0]
        else:
            first_name_jp = member['name_jp'].split(' ')[1]
        first_name_en = member['name_en'].split(' ')[0]
        if story_name in [first_name_en, first_name_jp]:
            return member

    return None


def template_all_card_skill_info():
    active_skids = []
    passive_skids = []
    all_cards = get_resource('cards/all')
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
    return get_resource('cards/latest')


def filter_skill_short(skill, split="\n"):
    efs = []
    for effect in skill['effects']:
        efs.append(effect['short_display'])
    return split.join(efs)


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

        # format effect string
        s_effect_vals = util_filter_to_unique(effect['effect']['values'])

        format_type = effect['effect']['value_type']
        effect_vals = '/'.join(map(format_val, s_effect_vals))
        if len(s_effect_vals) > 1:
            effect_vals = '[%s]' % effect_vals

        until_vals = ''
        # format effect until string if it exists
        if effect['effect']['until']:
            s_until_vals = util_filter_to_unique(
                effect['effect']['until']['values'])

            format_type = effect['effect']['until']['value_type']
            until_vals = '/'.join(map(format_val, s_until_vals))
            if len(s_until_vals) > 1:
                until_vals = '[%s]' % until_vals

        effect_str = effect_format.format(effect=effect_vals, until=until_vals)

        # format trigger string if it exists
        trigger_str = None
        if effect['trigger']:
            s_trigger_vals = util_filter_to_unique(effect['trigger']['values'])
            s_trigger_chances = util_filter_to_unique(
                effect['trigger']['chances'])

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


def filter_acc_skill(skill):
    chances = skill['chances']
    values = skill['values']

    effect = skill['effect']

    format_type = None

    # format a value based off format type
    def format_val(val):
        if format_type == 'percent':
            return '{0:.5g}%'.format(val*100)
        else:
            return str(val)

    show_chance = True
    format_type = 'percent'
    if chances[-1]['min'] == 1:
        show_chance = False
        chance_format = None
    else:
        min_str = format_val(chances[-1]['min'])
        max_str = format_val(chances[-1]['max'])
        if min_str == max_str:
            chance_format = min_str
        else:
            chance_format = f"[{min_str}-{max_str}]"

    lb_vals = None
    if len(values) > 1:
        format_type = effect['effect']['value_type']
        lb_vals = {}
        for i in range(len(values)):
            val = values[i]
            min_str = format_val(val['min'])
            max_str = format_val(val['max'])
            if min_str == max_str:
                val_format = min_str
            else:
                val_format = f"{min_str}-{max_str}"
            lb_vals[i] = val_format
    format_type = effect['effect']['value_type']
    min_str = format_val(values[-1]['min'])
    max_str = format_val(values[-1]['max'])
    if min_str == max_str:
        value_format = min_str
    else:
        value_format = f"[{min_str}-{max_str}]{'*' if lb_vals else ''}"

    until_str = ''
    if effect['effect']['until']:
        until_str = effect['effect']['until']['display']

    effect_str = effect['effect']['formatting'].format(effect=value_format)
    effect_str += f' {until_str}'

    trigger_str = None
    if effect['trigger']:
        if show_chance:
            trigger_str = f"{effect['trigger']['display']}, {chance_format} chance"
        else:
            trigger_str = effect['trigger']['display']

    target_str = None
    if effect['target']:
        target_str = effect['target']['display']

    return {
        'effect': effect_str,
        'trigger': trigger_str,
        'target': target_str,
        'lb_vals': lb_vals
    }


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


def filter_card_classes(card):
    classes = [
        f"card-member-{card['member']['id']}",
        f"card-group-{card['member']['group']['id']}",
        f"card-rarity-{card['rarity']['id']}",
        f"card-attribute-{card['attribute']['id']}",
        f"card-role-{card['role']['id']}"
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


def filter_epoch(time, tz=None):
    time = datetime.fromtimestamp(time)
    if tz:
        tz_obj = pytz.timezone(tz)
        time = time.astimezone(tz_obj)
    return time.strftime("%B %d, %Y %H:%M")


def filter_find(arr, all_true=False, **kwargs):
    for obj in arr:
        if not all_true:
            for k, v in kwargs.items():
                if k in obj and (obj[k] == v or str(obj[k]) == str(v)):
                    return obj
        else:
            check = True
            for k, v in kwargs.items():
                if k not in obj or (obj[k] != v and str(obj[k]) != str(v)):
                    check = False
            if check:
                return obj
    return None


def add_globals(app):
    app.jinja_env.globals.update({
        'tex': template_tex_url,
        'icon': template_ui_url,
        'card_info': template_card_info,
        'accessory_info': template_accessory_info,
        'live_info': template_live_info,
        'difficulty_info': template_difficulty_info,
        'tower_info': template_tower_info,
        'event_info': template_event_info,
        'cards': template_card_list,
        'lives': template_live_list,
        'events': template_event_list,
        'sets': template_set_list,
        'accessories': template_accessory_list,
        'get_card_set': template_get_card_set,
        'latest_cards': template_card_latest,
        'member_info': template_member_info,
        'group_info': template_group_info,
        'unit_info': template_unit_info,
        'all_card_skill_info': template_all_card_skill_info,
        'stories': template_story_directory,
        'script': template_script,
        'transcript': template_transcript,
        'script_path_obj': template_script_path_obj,
        'find_member_from_name': template_find_member_by_story_name
    })

    app.add_template_filter(filter_skill_short, name='skill_short')
    app.add_template_filter(filter_skill, name='skill')
    app.add_template_filter(filter_acc_skill, name='acc_skill')
    app.add_template_filter(filter_loc_name, name='loc_name')
    app.add_template_filter(filter_card_classes, name='card_classes')
    app.add_template_filter(filter_epoch, name='epoch')
    app.add_template_filter(filter_find, name='find')
