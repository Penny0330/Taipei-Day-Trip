from flask import *
import data.data_connection
import jwt
import os
from dotenv import load_dotenv
load_dotenv()

jwt_key = os.getenv("jwt_key")

historyOrder = Blueprint("historyOrder",
                         __name__,
                         static_folder="static",
                         template_folder="templates"
                         )

connection_pool = data.data_connection.connection()


@historyOrder.route("/api/history", methods=["GET"])
def history():
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
                    "SELECT * FROM `order` JOIN `member` ON `order`.`member_id` = `member`.`id` WHERE `member_id` = %s ORDER BY `order_number` DESC", [user_id])
                data = cur.fetchall()
                if data:

                    result = {
                        "data": data
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
