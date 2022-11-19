from flask import *
import data.data_connection

# 建立 Blueprint 物件
attraction_categories = Blueprint("attraction_categories", __name__)

connection_pool = data.data_connection.connection()


# 取得景點分類列表
@attraction_categories.route("/api/categories")
def categories():
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True)

        cursor.execute("SELECT DISTINCT `CAT` FROM `attractions`")
        categories = cursor.fetchall()

        categoriesList = []
        for data in categories:
            categoriesList.append(data["CAT"])

        return jsonify({"data": categoriesList})

    except 500:
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500

    finally:
        cursor.close()
        connection_object.close()
