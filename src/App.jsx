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
  return (
    <div>
      <h1>大会一覧</h1>
      <p>件数: {tournaments.length}</p>

      {tournaments.map((tournament, index) => (
        <div key={index}>
          <h2>{tournament.title}</h2>
          <p>日付: {tournament.date}</p>
          <p>場所: {tournament.place}</p>
          <p>参加費: {tournament.fee}円</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
