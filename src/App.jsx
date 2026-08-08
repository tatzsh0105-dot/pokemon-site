import { useEffect, useState } from "react";

function App() {
  const [tournaments, setTournaments] = useState([]);
  const [editingTournament, setEditingTournament] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // 検索用
  const [searchPrefecture, setSearchPrefecture] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [hideFinished, setHideFinished] = useState(false);

  // 新規大会追加用
  const [newTournament, setNewTournament] = useState({
    title: "",date: "",time: "10:00",prefecture: "東京都",
    location: "",fee: 0,url: "",
  });

  const prefectures = [
    "東京都","神奈川県","埼玉県","千葉県","茨城県","栃木県","群馬県",
  ];

  const times = [
    "9:00","9:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30",
    "14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30",
    "19:00","19:30","20:00",
  ];

  // 大会一覧取得
  useEffect(() => {
    fetch("http://127.0.0.1:8000/tournaments")
      .then((response) => response.json())
      .then((data) => {
        console.log("取得成功", data);
        setTournaments(data);
      })
      .catch((error) => {
        console.error("取得失敗", error);
      });
  }, []);

  // 削除
  const deleteTournament = async (id) => {
    await fetch(`http://127.0.0.1:8000/tournaments/${id}`, {
      method: "DELETE",
    });

    setTournaments(
      tournaments.filter((tournament) => tournament.id !== id)
    );
  };

  // 編集開始
  const editTournament = (tournament) => {
    setEditingTournament({ ...tournament });
  };

  // 編集保存
  const saveTournament = async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/tournaments/${editingTournament.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingTournament),
      }
    );

    if (response.ok) {
      setTournaments(
        tournaments.map((tournament) =>
          tournament.id === editingTournament.id
            ? editingTournament
            : tournament
        )
      );

      setEditingTournament(null);
    }
  };

  // 新規追加
  const addTournament = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/tournaments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTournament),
      }
    );

    if (response.ok) {
      const updatedResponse = await fetch(
        "http://127.0.0.1:8000/tournaments"
      );

      const updatedTournaments = await updatedResponse.json();

      setTournaments(updatedTournaments);

      setNewTournament({
        title: "",
        date: "",
        time: "10:00",
        prefecture: "東京都",
        location: "",
        fee: 0,
        url: "",
      });

      setShowAddForm(false);
    }
  };

  // 検索・絞り込み
  const filteredTournaments = tournaments.filter((tournament) => {
    // 都道府県
    if (
      searchPrefecture !== "" &&
      tournament.prefecture !== searchPrefecture
    ) {
      return false;
    }

    // 日付
    if (
      searchDate !== "" &&
      tournament.date !== searchDate
    ) {
      return false;
    }

    // 終了大会を非表示
    if (hideFinished) {
      const now = new Date();

      const tournamentDateTime = new Date(
        `${tournament.date}T${tournament.time}`
      );

      if (tournamentDateTime < now) {
        return false;
      }
    }

    return true;
  });

  return (
    <div>
      <h1>ポケカトーナメント</h1>

      {/* 上部操作エリア */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "30px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {/* 大会追加 */}
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)}>
            大会を追加
          </button>
        )}

        {/* 都道府県検索 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <label>都道府県</label>

          <select
            value={searchPrefecture}
            onChange={(e) =>
              setSearchPrefecture(e.target.value)
            }
          >
            <option value="">すべて</option>

            {prefectures.map((prefecture) => (
              <option
                key={prefecture}
                value={prefecture}
              >
                {prefecture}
              </option>
            ))}
          </select>
        </div>

        {/* 日付検索 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <label>日付</label>

          <input
            type="date"
            value={searchDate}
            onChange={(e) =>
              setSearchDate(e.target.value)
            }
          />
        </div>

        {/* 終了大会を非表示 */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <input
            type="checkbox"
            checked={hideFinished}
            onChange={(e) =>
              setHideFinished(e.target.checked)
            }
          />
          終了した大会を非表示
        </label>
      </div>

      {/* 大会追加フォーム */}
      {showAddForm && (
        <div>
          <h2>大会を追加</h2>

          <p>大会名</p>
          <input
            type="text"
            value={newTournament.title}
            onChange={(e) =>
              setNewTournament({
                ...newTournament,
                title: e.target.value,
              })
            }
          />

          <p>日付</p>
          <input
            type="date"
            value={newTournament.date}
            onChange={(e) =>
              setNewTournament({
                ...newTournament,
                date: e.target.value,
              })
            }
          />

          <p>開催時間</p>
          <select
            value={newTournament.time}
            onChange={(e) =>
              setNewTournament({
                ...newTournament,
                time: e.target.value,
              })
            }
          >
            {times.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <p>都道府県</p>
          <select
            value={newTournament.prefecture}
            onChange={(e) =>
              setNewTournament({
                ...newTournament,
                prefecture: e.target.value,
              })
            }
          >
            {prefectures.map((prefecture) => (
              <option
                key={prefecture}
                value={prefecture}
              >
                {prefecture}
              </option>
            ))}
          </select>

          <p>開催場所</p>
          <input
            type="text"
            value={newTournament.location}
            onChange={(e) =>
              setNewTournament({
                ...newTournament,
                location: e.target.value,
              })
            }
          />

          <p>参加費</p>
          <input
            type="number"
            value={newTournament.fee}
            onChange={(e) =>
              setNewTournament({
                ...newTournament,
                fee: Number(e.target.value),
              })
            }
          />

          <p>URL</p>
          <input
            type="url"
            value={newTournament.url}
            onChange={(e) =>
              setNewTournament({
                ...newTournament,
                url: e.target.value,
              })
            }
          />

          <br />
          <br />

          <button onClick={addTournament}>
            決定
          </button>

          <button
            onClick={() => setShowAddForm(false)}
          >
            キャンセル
          </button>

          <hr />
        </div>
      )}

      {/* 大会一覧 */}
      <h2>大会一覧</h2>

      <p>件数: {filteredTournaments.length}</p>

      {filteredTournaments.map((tournament) => (
        <div key={tournament.id}>
          <h2>{tournament.title}</h2>

          <p>日付: {tournament.date}</p>
          <p>開催時間: {tournament.time}</p>
          <p>都道府県: {tournament.prefecture}</p>
          <p>開催場所: {tournament.location}</p>
          <p>参加費: {tournament.fee}円</p>

          <p>
            URL:
            <a
              href={tournament.url}
              target="_blank"
              rel="noreferrer"
            >
              {tournament.url}
            </a>
          </p>

          <button
            onClick={() =>
              editTournament(tournament)
            }
          >
            編集
          </button>

          <button
            onClick={() =>
              deleteTournament(tournament.id)
            }
          >
            削除
          </button>

          {/* 編集フォーム */}
          {editingTournament &&
            editingTournament.id === tournament.id && (
              <div>
                <h3>大会情報を編集中</h3>

                <p>大会名</p>
                <input
                  type="text"
                  value={editingTournament.title}
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      title: e.target.value,
                    })
                  }
                />

                <p>日付</p>
                <input
                  type="date"
                  value={editingTournament.date}
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      date: e.target.value,
                    })
                  }
                />

                <p>開催時間</p>
                <select
                  value={editingTournament.time}
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      time: e.target.value,
                    })
                  }
                >
                  {times.map((time) => (
                    <option
                      key={time}
                      value={time}
                    >
                      {time}
                    </option>
                  ))}
                </select>

                <p>都道府県</p>
                <select
                  value={
                    editingTournament.prefecture
                  }
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      prefecture: e.target.value,
                    })
                  }
                >
                  {prefectures.map((prefecture) => (
                    <option
                      key={prefecture}
                      value={prefecture}
                    >
                      {prefecture}
                    </option>
                  ))}
                </select>

                <p>開催場所</p>
                <input
                  type="text"
                  value={editingTournament.location}
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      location: e.target.value,
                    })
                  }
                />

                <p>参加費</p>
                <input
                  type="number"
                  step={100}
                  value={editingTournament.fee}
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      fee: Number(e.target.value),
                    })
                  }
                />

                <p>URL</p>
                <input
                  type="url"
                  value={editingTournament.url}
                  onChange={(e) =>
                    setEditingTournament({
                      ...editingTournament,
                      url: e.target.value,
                    })
                  }
                />

                <br />
                <br />

                <button onClick={saveTournament}>
                  保存
                </button>

                <button
                  onClick={() =>
                    setEditingTournament(null)
                  }
                >
                  キャンセル
                </button>
              </div>
            )}

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;