from flask import *
import data.data_connection
import jwt
from datetime import datetime
import os
from dotenv import load_dotenv
load_dotenv()

jwt_key = os.getenv("jwt_key")

booking = Blueprint("booking",
                    __name__,
                    static_folder="static",
                    template_folder="templates"
                    )


connection_pool = data.data_connection.connection()


@booking.route("/api/booking", methods=["GET"])
def checkBooking():
    try:
        connection_object = connection_pool.get_connection()
        cur = connection_object.cursor(buffered=True, dictionary=True)
        # 是否有登入
        token = request.cookies.get("token")
        if token:
            user = jwt.decode(token, jwt_key, algorithms=["HS256"])
            # token 是否正確
            if user:
                # 正確的話取得 user id
                user_id = user["id"]

                cur.execute(
                    "SELECT `attractions`.`id`, `attractions`.`name`, `attractions`.`address`, `attractions`.`file`, `booking`.`date`, `booking`.`time`, `booking`.`price`  FROM `booking` JOIN `attractions` ON `booking`.`attraction_id` = `attractions`.`id` WHERE `user_id` = %s", [user_id])

                user_booking = cur.fetchone()

                if not user_booking:

                    return jsonify({
                        "data": None
                    })

                date = datetime.strftime(user_booking["date"], "%Y-%m-%d")

                result = {
                    "data": {
                        "attraction": {
                            "id": user_booking["id"],
                            "name": user_booking["name"],
                            "address": user_booking["address"],
                            "images": user_booking["file"].split('"')[1]
                        },
                        "date": date,
                        "time": user_booking["time"],
                        "price": user_booking["price"]
                    }
                }

                return result, 200

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


@booking.route("/api/booking", methods=["POST"])
def newBooking():
    try:
        connection_object = connection_pool.get_connection()
        cur = connection_object.cursor()

        attractionId = request.json["attractionId"]
        date = request.json["date"]
        time = request.json["time"]
        price = request.json["price"]

        token = request.cookies.get("token")
        if token:
            user = jwt.decode(token, jwt_key, algorithms=["HS256"])
            if user:
                user_id = user["id"]

                if not attractionId or not date or not time or not price:
                    return jsonify({
                        "error": True,
                        "message": "此訂單的資訊不完整，請重新選擇"
                    }), 400

                # 查詢 user id 在 booking 裡是否有訂單， 有就更新
                cur.execute(
                    "SELECT *  FROM `booking` WHERE `user_id` = %s", [user_id])
                booking = cur.fetchone()
                if booking:
                    update = "UPDATE `booking` SET `attraction_id` = %s, `date` = %s, `time` = %s, `price` = %s WHERE `user_id` = %s"
                    value = (attractionId, date, time, price, user_id)
                    cur.execute(update, value)
                    connection_object.commit()
                    return jsonify({
                        "update": True,
                        "message": "訂單已更新"
                    }), 200
                else:
                    # 無訂單就寫入databases
                    insert = "INSERT INTO `booking`(`user_id`, `attraction_id`, `date`, `time`, `price`) VALUES (%s, %s, %s, %s, %s)"
                    value = (user_id, attractionId, date, time, price)
                    cur.execute(insert, value)
                    connection_object.commit()
                    return jsonify({
                        "ok": True,
                        "message": "訂單已成立"
                    }), 200

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


@booking.route("/api/booking", methods=["DELETE"])
def deleteBooking():
    try:
        connection_object = connection_pool.get_connection()
        cur = connection_object.cursor(buffered=True, dictionary=True)
        # 是否有登入
        token = request.cookies.get("token")
        if token:
            user = jwt.decode(token, jwt_key, algorithms=["HS256"])
            # 檢查 token 是否正確
            if user:
                # 正確的話取得 user id
                user_id = user["id"]

                cur.execute(
                    "SELECT `attractions`.`id` FROM `booking` JOIN `attractions` ON `booking`.`attraction_id` = `attractions`.`id` WHERE `user_id` = %s", [user_id])

                attraction_number = cur.fetchone()

                cur.execute(
                    "DELETE FROM `booking` WHERE `attraction_id` = %s", [attraction_number["id"]])
                connection_object.commit()

                return jsonify({
                    "ok": True
                }), 200

            return jsonify({
                "data": None
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
