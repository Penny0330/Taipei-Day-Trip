from flask import *
import data.data_connection
import re
from flask_bcrypt import Bcrypt
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
load_dotenv()

# 建立 Blueprint 物件
auth = Blueprint("auth",
                 __name__,
                 static_folder="static",
                 template_folder="templates"
                 )


connection_pool = data.data_connection.connection()

bcrypt = Bcrypt()

jwt_key = os.getenv("jwt_key")


# ----- signup -----
@auth.route("/api/user", methods=["POST"])
def signup():
    try:
        name = request.json["name"]
        email = request.json["email"]
        password = request.json["password"]

        connection_object = connection_pool.get_connection()
        cur = connection_object.cursor()

        if name == "" or email == "" or password == "":
            return jsonify({
                "error": True,
                "message": "有欄位空白，未填寫"
            })
        elif len(name) < 1 or len(name) > 8:
            return jsonify({
                "error": True,
                "message": "姓名長度須介於1-8個字元"
            })
        elif not re.match("^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$", email):
            return jsonify({
                "error": True,
                "message": "電子信箱格式錯誤"
            })
        elif len(password) < 6 or len(password) > 10:
            return jsonify({
                "error": True,
                "message": "密碼長度須介於6-10個字元"
            })
        else:
            cur.execute(
                "SELECT `email` FROM `member` WHERE `email` = %s", [email])
            user_email = cur.fetchone()

            if user_email:
                return jsonify({
                    "error": True,
                    "message": "此 email 已被註冊"
                })
            else:
                hashed_password = bcrypt.generate_password_hash(
                    password=password)
                insert = "INSERT INTO `member`(`name`, `email`, `password`) VALUES (%s, %s, %s)"
                value = (name, email, hashed_password)
                cur.execute(insert, value)
                connection_object.commit()
                return jsonify({
                    "ok": True,
                    "message": "註冊成功 :) 請重新登入"
                })
    except 500:
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500
    finally:
        cur.close()
        connection_object.close()


# ----- check status -----
@auth.route("/api/user/auth", methods=["GET"])
def signIn_status():
    token = request.cookies.get("token")
    if token:
        user = jwt.decode(token, jwt_key, algorithms=["HS256"])
        return jsonify({
            "data": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        })
    return jsonify({
        "data": None
    })


# ----- signIn -----
@auth.route("/api/user/auth", methods=["PUT"])
def signin():
    try:
        connection_object = connection_pool.get_connection()
        cur = connection_object.cursor()

        email = request.json["email"]
        password = request.json["password"]

        if email == "" or password == "":
            return jsonify({
                "error": True,
                "message": "登入資料未輸入完整"
            })
        elif not re.match("^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$", email):
            return jsonify({
                "error": True,
                "message": "電子信箱格式錯誤"
            })
        elif len(password) < 6 or len(password) > 10:
            return jsonify({
                "error": True,
                "message": "密碼長度須介於6-10個字元"
            })
        else:
            cur.execute(
                "SELECT * FROM `member` WHERE `email` = %s", [email])
            user = cur.fetchone()
            if user != None:
                check_password = bcrypt.check_password_hash(user[3], password)
                if check_password:
                    token = jwt.encode({"id": user[0],
                                        "name": user[1],
                                        "email": user[2], },
                                       jwt_key,
                                       algorithm="HS256")
                    response = make_response(
                        jsonify({"ok": True}))
                    outdate = datetime.utcnow() + timedelta(days=7)
                    response.set_cookie(
                        key="token", value=token, expires=outdate)
                    return response
            return jsonify({
                "error": True,
                "message": "信箱或密碼有誤"
            })
    except 500:
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500
    finally:
        cur.close()
        connection_object.close()


# ----- signOut -----
@auth.route("/api/user/auth", methods=["DELETE"])
def signOut():
    response = make_response(jsonify({"ok": True}))
    response.set_cookie("token", "", expires=-1)
    return response
