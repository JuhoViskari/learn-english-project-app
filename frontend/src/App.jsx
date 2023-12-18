import { useState, useEffect } from "react";

function App() {
  let [learning, setLearning] = useState([]);
  const fetchIt = async () => {
    let hr = await fetch("/api/learn");
    let data = await hr.json();
    setLearning(data);
  };

  let arr = learning.map((learning) => (
    <li key={learning.id}>
      Finnish: {learning.finnish}, english: {learning.english}
    </li>
  ));

  return (
    <>
      <h1>Learnings</h1>
      <div id="learning">{arr}</div>
      <button onClick={fetchIt}>Fetch</button>
    </>
  );
}

export default App;
