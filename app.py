from flask import *
from mysql.connector import pooling
# 匯入 blueprint
from attraction.attraction import attraction
from attraction.attraction_id import attraction_id
from attraction.attraction_categories import attraction_categories

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True


# 使用 register_blueprint 方法將 blueprint 註冊到 app
app.register_blueprint(attraction)
app.register_blueprint(attraction_id)
app.register_blueprint(attraction_categories)

# Pages


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")


app.run(port=3000, debug=True)
