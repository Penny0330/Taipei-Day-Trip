from flask import *
import data.data_connection

# 建立 Blueprint 物件
attraction = Blueprint("attraction", __name__)

connection_pool = data.data_connection.connection()


# 取得不同分頁的景點列表資料 & 關鍵字篩選
@attraction.route("/api/attractions")
def attraction_all():
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True)

        page = int(request.args.get("page"))  # 取前端輸入的 page 值
        keyword = request.args.get("keyword")  # 取前端輸入的 keyword 值

        # 有 keyword
        if keyword != None:
            cursor.execute(
                "SELECT COUNT(*) FROM `attractions` WHERE `CAT` LIKE %s OR `name` LIKE %s", [keyword, f'%{keyword}%'])
            count = cursor.fetchone()
            count = count["COUNT(*)"]

            if count == 0:
                return jsonify({
                    "error": True,
                    "message": "查無相關景點"
                })

            else:
                # 頁面數: 若 總數量 - 所在頁數 * 12 後，大於 12，則代表還有下一頁
                if count - page*12 > 12:
                    nextPage = page + 1
                else:
                    nextPage = None

                # 拿取符合的資料: LIMIT 從第幾筆開始, 資料數量
                cursor.execute(
                    "SELECT * FROM `attractions` WHERE `CAT` LIKE %s OR  `name` LIKE %s LIMIT %s, 12", [keyword, f'%{keyword}%', page*12])
                attractions = cursor.fetchall()

                dataList = []
                for data in attractions:
                    data["file"] = json.loads(data["file"])
                    dataList.append({"id": data["id"],
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
                                     })

                return jsonify({"nextPage": nextPage,
                                "data": dataList
                                })

        # 沒有 keyword
        else:
            cursor.execute("SELECT COUNT(*) FROM `attractions`")
            count = cursor.fetchone()
            count = count["COUNT(*)"]

            if count == 0:
                return jsonify({
                    "error": True,
                    "message": "查無相關景點"
                })

            else:
                if count - page*12 > 12:
                    nextPage = page + 1
                else:
                    nextPage = None

                cursor.execute(
                    "SELECT * FROM `attractions` LIMIT %s, 12", [page*12])
                attractions = cursor.fetchall()

                dataList = []
                for data in attractions:
                    data["file"] = json.loads(data["file"])
                    dataList.append({"id": data["id"],
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
                                     })

                return jsonify({"nextPage": nextPage,
                                "data": dataList
                                })
    except 500:
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500
    finally:
        cursor.close()
        connection_object.close()
