from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class Tournament(BaseModel):
    title: str
    date: str
    time: str
    prefecture: str
    location: str
    fee: int
    url: str



@app.get("/tournaments")
def get_tournaments(prefecture: str = None):


    conn = sqlite3.connect("tournaments.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    if prefecture:
        cur.execute(
            "SELECT * FROM tournaments WHERE prefecture LIKE ?",
            (f"%{prefecture}%",)
        )
    else:
        cur.execute("SELECT * FROM tournaments")

    rows = cur.fetchall()

    tournaments = [dict(row) for row in rows]

    conn.close()

    return tournaments


@app.post("/tournaments")
def add_tournament(tournament: Tournament):

    conn = sqlite3.connect("tournaments.db")
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO tournaments(title, date, time,prefecture,location, fee, url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            tournament.title,
            tournament.date,
            tournament.time,
            tournament.prefecture,
            tournament.location,
            tournament.fee,
            tournament.url
        )
    )

    conn.commit()
    conn.close()

    return {"message": "追加しました"}

@app.delete("/tournaments/{tournament_id}")
def delete_tournament(tournament_id: int):

    conn = sqlite3.connect("tournaments.db")
    cur = conn.cursor()

    cur.execute(
        "DELETE FROM tournaments WHERE id = ?",
        (tournament_id,)
    )

    conn.commit()
    conn.close()

    return {"message": "削除しました"}

@app.put("/tournaments/{tournament_id}")
def update_tournament(tournament_id: int, tournament: Tournament):

    conn = sqlite3.connect("tournaments.db")
    cur = conn.cursor()

    cur.execute(
        """
        UPDATE tournaments
        SET title = ?, date = ?, time = ?, prefecture = ?,location = ?, fee = ?, url = ?
        WHERE id = ?
        """,
        (
            tournament.title,
            tournament.date,
            tournament.time,
            tournament.prefecture,
            tournament.location,
            tournament.fee,
            tournament.url,
            tournament_id
        )
    )

    conn.commit()
    conn.close()

    return {"message": "更新しました"}
