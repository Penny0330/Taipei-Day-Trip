from mysql.connector import pooling

import os
# nev 隱藏敏感資訊
from dotenv import load_dotenv
load_dotenv()


def connection():
    return pooling.MySQLConnectionPool(
        pool_name="connection_pool",
        pool_size=5,
        pool_reset_session=True,
        host=os.getenv("host"),
        user=os.getenv("user"),
        password=os.getenv("password"),
        database=os.getenv("database")
    )
