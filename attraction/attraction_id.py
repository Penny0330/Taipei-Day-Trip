from flask import *
import data.data_connection

# 建立 Blueprint 物件
attraction_id = Blueprint("attraction_id",
                          __name__,
                          static_folder="static",
                          template_folder="templates"
                          )

connection_pool = data.data_connection.connection()


# 根據景點編號取得景點
@attraction_id.route("/api/attraction/<attractionId>")
def attractionsId(attractionId):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM `attractions` WHERE `id` = %s", [attractionId])
        data = cursor.fetchone()

        if data != None:
            data["file"] = json.loads(data["file"])
            return jsonify({
                "data": {
                    "id": data["id"],
                    "name": data["name"],
                    "category": data["CAT"],
                    "rate": data["rate"],
                    "description": data["description"],
                    "address": data["address"],
                    "transport": data["direction"],
                    "mrt": data["MRT"],
                    "lat": data["latitude"],
                    "lng": data["longitude"],
                    "images": data["file"]
                }
            })
        else:
            return jsonify({
                "error": True,
                "message": "景點編號不正確"
            }), 400

    except 500:
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500

    finally:
        cursor.close()
        connection_object.close()
