from flask import Blueprint, Response, render_template
import requests

default = Blueprint('default', __name__, template_folder="templates", static_folder="static",
                    static_url_path="")


@default.route('/')
def home():
    return render_template('pages/home.html')


@default.route('/card/<card_id>/')
def card_view(card_id):
    return render_template('pages/card_view.html', card_id=card_id)


@default.route('/live/<live_id>/')
def live_view(live_id):
    return render_template('pages/live_view.html', live_id=live_id)


@default.route('/accessory/<acc_id>')
def acc_view(acc_id):
    return render_template('pages/accessory_view.html', acc_id=acc_id)


@default.route('/event/<event_type>/<event_id>')
def event_view(event_type, event_id):
    if event_type not in ['tower']:
        return Response(404)
    return render_template(f'pages/event/{event_type}.html', event_id=event_id)


@default.route('/cards/')
def card_list():
    return render_template('pages/card_list.html')


@default.route('/lives/')
def event_list():
    return render_template('pages/live_list.html')


@default.route('/events/')
def live_list():
    return render_template('pages/event_list.html')


@default.route('/accessories/')
def acc_list():
    return render_template('pages/accessory_list.html')
