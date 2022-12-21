from flask import *
# from mysql.connector import pooling
# 匯入 blueprint
from api.attraction import attraction
from api.auth import auth
from api.booking import booking
from api.order import order
from api.historyOrder import historyOrder

app = Flask(__name__,
            static_folder="static",
            static_url_path="/"
            )

app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["JSON_SORT_KEYS"] = False  # 排序 JSON


# 使用 register_blueprint 方法將 blueprint 註冊到 app
app.register_blueprint(attraction)
app.register_blueprint(auth)
app.register_blueprint(booking)
app.register_blueprint(order)
app.register_blueprint(historyOrder)

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


@app.route("/history")
def history():
    return render_template("history.html")


app.run(host="0.0.0.0", port=3000, debug=True)
