import sqlite3


def init_db():

    conn = sqlite3.connect("forecasts.db")

    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS forecasts (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            revenue INTEGER,

            roas REAL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )
    """)

    conn.commit()
    conn.close()