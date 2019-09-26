from flask import Flask, render_template, request, jsonify
from flask_caching import Cache
import pickledb
import json
from collections import OrderedDict
from dateutil import parser
from datetime import datetime


db = pickledb.load('data.db', False)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/add_task', methods=['POST'])
def add_task():
    time = request.form['time']
    task = request.form['task']
    time = str(parser.parse(time))
    if not db.exists(time):
        db.set(time, task)
        db.dump()
        return "Added to db"
    else:
        return "Already in db"


@app.route('/get_tasks', methods=['GET'])
def get_tasks():
    all_tasks = OrderedDict()
    for time in db.getall():
        task = db.get(time)
        all_tasks.update({time: task})
    new_d = OrderedDict(sorted(all_tasks.items(), reverse=False))
    return json.dumps(new_d)


@app.route('/do_task', methods=['POST', 'GET'])
def do_task():
    time = request.form['time']
    if db.exists(time):
        db.rem(time)
        db.dump()
        return "Removed from db"
    else:
        return "Not in db"


if __name__ == '__main__':
    app.run(debug=True)
