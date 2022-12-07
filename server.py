"""Server for the thought flow app"""

from flask import (Flask, render_template, redirect, request, jsonify, flash, session)
from jinja2 import StrictUndefined
from model import connect_to_db, db


app = Flask(__name__
# template_folder='../templates',
# static_folder='../static'
)
app.secret_key = 'dev'
app.jinja_env.undefined = StrictUndefined

stars = '*' * 10


@app.route('/')
def show_home():
    """View homepage."""

    return render_template('index.html')



if __name__ =='__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)