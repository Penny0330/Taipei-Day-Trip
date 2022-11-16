import mysql.connector
import json

connection = mysql.connector.connect(
    host="localhost",
    port="3306",
    user="root",
    password="123456",
    database="db"
)

with open("taipei-attractions.json", mode="r", encoding="utf-8") as file:
    dataAll = json.load(file)
    dataAll = dataAll["result"]["results"]

    for data in dataAll:
        rate = data["rate"]
        direction = data["direction"]
        name = data["name"]
        date = data["date"]
        longitude = data["longitude"]
        REF_WP = data["REF_WP"]
        avBegin = data["avBegin"]
        langinfo = data["langinfo"]
        MRT = data["MRT"]
        SERIAL_NO = data["SERIAL_NO"]
        RowNumber = data["RowNumber"]
        CAT = data["CAT"]
        MEMO_TIME = data["MEMO_TIME"]
        POI = data["POI"]

        # file 處理
        file = data["file"]
        file = file.lower()
        file = file.split("https")
        new_file = []
        for url in file:
            if "jpg" in url or "png" in url:
                url = "https" + url
                new_file.append(url)
        new_file = json.dumps(new_file)  # Change to json [str]

        idpt = data["idpt"]
        latitude = data["latitude"]
        description = data["description"]
        _id = data["_id"]
        avEnd = data["avEnd"]
        address = data["address"]

        try:
            mycursor = connection.cursor()
            insert = "INSERT INTO `attractions`(`rate`, `direction`, `name`, `date`, `longitude`, `REF_WP`, `avBegin`,      `langinfo`, `MRT`, `SERIAL_NO`,`RowNumber`, `CAT`, `MEMO_TIME`, `POI`, `file`, `idpt`, `latitude`, `description`, `_id`, `avEnd`, `address`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            value = (rate, direction, name, date, longitude, REF_WP, avBegin, langinfo, MRT, SERIAL_NO,
                     RowNumber, CAT, MEMO_TIME, POI, new_file, idpt, latitude, description, _id, avEnd, address)
            mycursor.execute(insert, value)
            connection.commit()
        except:
            print("Error")

    mycursor.close()
    connection.close()
