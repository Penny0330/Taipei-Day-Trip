from flask import *
import data.data_connection
import requests
import jwt
import datetime
from datetime import datetime
import os
from dotenv import load_dotenv
load_dotenv()

jwt_key = os.getenv("jwt_key")
partner_key = os.getenv("partner_key")
merchant_id = os.getenv("merchant_id")

order = Blueprint("order",
                  __name__,
                  static_folder="static",
                  template_folder="templates"
                  )

connection_pool = data.data_connection.connection()


@order.route("/api/orders", methods=["POST"])
def newOrder():
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

                if not request.json["order"]["contact"]["name"] or not request.json["order"]["contact"]["email"] or not request.json["order"]["contact"]["phone"]:
                    return jsonify({
                        "error": True,
                        "message": "聯絡資訊不完整，訂單建立失敗"
                    }), 400

                now_datetime = datetime.now()
                now_datetime = now_datetime.strftime("%Y%m%d%H%M%S")
                order_number = now_datetime + str(user_id)

                prime = request.json["prime"]
                price = request.json["order"]["price"]
                attraction_id = request.json["order"]["trip"]["attraction"]["id"]
                attraction_name = request.json["order"]["trip"]["attraction"]["name"]
                attraction_address = request.json["order"]["trip"]["attraction"]["address"]
                attraction_image = request.json["order"]["trip"]["attraction"]["image"]
                date = request.json["order"]["trip"]["date"]
                time = request.json["order"]["trip"]["time"]
                user_name = request.json["order"]["contact"]["name"]
                user_email = request.json["order"]["contact"]["email"]
                user_phone = request.json["order"]["contact"]["phone"]

                # 將訂單及付款資訊寫入資料庫
                insert = "INSERT INTO `order`(`member_id`, `order_number`, `price`, `attraction_id`, `attraction_name`, `attraction_address`, `attraction_image`, `date`, `time`, `name`, `email`, `phone`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
                value = (user_id, order_number, price, attraction_id, attraction_name, attraction_address,
                         attraction_image, date, time, user_name, user_email, user_phone)
                cur.execute(insert, value)
                connection_object.commit()

                url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
                headers = {
                    "Content-Type": "application/json",
                    "x-api-key": partner_key
                }
                data = {
                    "prime": prime,
                    "partner_key": partner_key,
                    "merchant_id": "penny0330_NCCC",
                    "details": "TapPay Test",
                    "amount": price,
                    "cardholder": {
                        "phone_number": "+8869" + user_phone[2:11],
                        "name": user_name,
                        "email": user_email,
                    }
                }

                result = requests.post(
                    url, headers=headers, json=data, timeout=30).json()

                if result["status"] == 0:
                    cur.execute(
                        "DELETE FROM `booking` WHERE `attraction_id` = %s", [attraction_id])
                    connection_object.commit()

                    return jsonify({
                        "data": {
                            "number": order_number,
                            "payment": {
                                "status": result["status"],
                                "message": "付款成功"
                            }
                        }
                    }), 200

                else:
                    return jsonify({
                        "data": {
                            "number": order_number,
                            "payment": {
                                "status": result["status"],
                                "message": "付款失敗"
                            }
                        }
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


@order.route("/api/order/<orderNumber>", methods=["GET"])
def getOrder(orderNumber):
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

                cur.execute(
                    "SELECT * FROM `order` WHERE `order_number` = %s", [orderNumber])
                data = cur.fetchone()

                if data:
                    result = {
                        "data": {
                            "number": orderNumber,
                            "price": data["price"],
                            "trip": {
                                "attraction": data["attraction_id"],
                                "name": data["attraction_name"],
                                "address": data["attraction_address"],
                                "image": data["attraction_image"]
                            },
                            "date": data["date"],
                            "time": data["time"],
                            "contact": {
                                "name": data["name"],
                                "email": data["email"],
                                "phone": "0" + str(data["phone"])
                            },
                            "status": 0
                        }
                    }
                else:
                    result = {
                        "data": None
                    }

                return make_response(result), 200

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
