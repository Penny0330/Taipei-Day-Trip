from flask import *
import data.data_connection
import jwt
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
load_dotenv()

bcrypt = Bcrypt()
jwt_key = os.getenv("jwt_key")

memberShip = Blueprint("memberShip",
                       __name__,
                       static_folder="static",
                       template_folder="templates"
                       )

connection_pool = data.data_connection.connection()


@memberShip.route("/api/member/name", methods=["POST"])
def memberName():
    try:
        connection_object = connection_pool.get_connection()
        cur = connection_object.cursor(buffered=True, dictionary=True)

        # 是否有登入
        token = request.cookies.get("token")
        if token:
            user = jwt.decode(token, jwt_key, algorithms=["HS256"])
            # token 是否正確
            if user:
                user_id = user["id"]
                user_email = user["email"]

                new_name = request.json["name"]

                if not new_name or len(new_name) < 1 or len(new_name) > 8:
                    return jsonify({
                        "error": True,
                        "message": "更新失敗"
                    }), 400

                cur.execute(
                    "UPDATE `member` SET `name` = %s WHERE `id` = %s", [new_name, user_id])
                connection_object.commit()
                token = jwt.encode({"id": user_id,
                                    "name": new_name,
                                    "email": user_email, },
                                   jwt_key,
                                   algorithm="HS256")
                response = make_response(
                    jsonify({"ok": True,
                             "message": "更新成功"
                             }))

                outdate = datetime.utcnow() + timedelta(days=7)

                response.set_cookie(
                    key="token", value=token, expires=outdate)

                return response

        return jsonify({
            "error": True,
            "message": "未登入系統，無法作業"
        }), 403

    except 500:
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500
    finally:
        cur.close()
        connection_object.close()


@memberShip.route("/api/member/password", methods=["POST"])
def memberPassword():
    try:
        connection_object = connection_pool.get_connection()
        cur = connection_object.cursor(buffered=True, dictionary=True)

        # 是否有登入
        token = request.cookies.get("token")
        if token:
            user = jwt.decode(token, jwt_key, algorithms=["HS256"])
            # token 是否正確
            if user:
                user_id = user["id"]

                old_password = request.json["old_password"]
                new_password = request.json["new_password"]

                if not old_password or not new_password or len(old_password) < 5 or len(new_password) < 5 or len(old_password) > 11 or len(new_password) > 11:
                    return jsonify({
                        "error": True,
                        "message": "更新失敗"
                    }), 400

                cur.execute(
                    "SELECT `password`  FROM `member` WHERE `id` = %s", [user_id])
                user_old_password = cur.fetchone()
                check_password = bcrypt.check_password_hash(
                    user_old_password["password"], old_password)

                if not check_password:
                    return jsonify({
                        "error": True,
                        "message": "更新失敗"
                    }), 400

                hashed_password = bcrypt.generate_password_hash(
                    password=new_password)

                cur.execute(
                    "UPDATE `member` SET `password` = %s WHERE `id` = %s", [hashed_password, user_id])
                connection_object.commit()

                return jsonify({
                    "data": True,
                    "message": "更新成功"
                })

        return jsonify({
            "error": True,
            "message": "未登入系統，無法作業"
        }), 403

    except 500:
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500
    finally:
        cur.close()
        connection_object.close()
