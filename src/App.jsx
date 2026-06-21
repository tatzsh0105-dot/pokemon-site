import { useEffect, useState } from "react";

function App() {
  const [tournaments, setTournaments] = useState([]);

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
  console.log(tournaments);
  const deleteTournament = async (id) => {
    await fetch(`http://127.0.0.1:8000/tournaments/${id}`, {
      method: "DELETE",
    });

    setTournaments(tournaments.filter((tournament) => tournament.id !== id));
  };
  return (
    <div>
      <h1>ポケカトーナメント</h1>
      <p>件数: {tournaments.length}</p>

      {tournaments.map((tournament, index) => (
        <div key={index}>
          <h2>{tournament.title}</h2>
          <p>日付: {tournament.date}</p>
          <p>場所: {tournament.place}</p>
          <p>参加費: {tournament.fee}円</p>
          <button onClick={() => deleteTournament(tournament.id)}>削除</button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
