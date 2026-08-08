import sqlite3

conn = sqlite3.connect("tournaments.db")
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    prefecture TEXT NOT NULL,
    location TEXT NOT NULL,
    fee INTEGER NOT NULL,
    url TEXT NOT NULL)
""")

conn.commit()
conn.close()

print("DB作成完了")
