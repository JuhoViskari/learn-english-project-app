import React, { useState, useEffect } from "react";

function LearnFinnish() {
  const [learning, setLearning] = useState([]);
  const [quessFinnish, setQuessFinnish] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        //developing fetch
        // const response = await fetch("http://localhost:8080/api/learn");
        const response = await fetch("/api/learn");
        const data = await response.json();
        setLearning(data);
        // Reset the current question when fetching new data
        setQuessFinnish(Array(data.lenght).fill(""));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    // Call the fetchAll function to initiate data fetching
    fetchAll();
  }, []);

  const handlequesses = (index, value) => {
    const newGuesses = [...quessFinnish];
    newGuesses[index] = value;
    setQuessFinnish(newGuesses);
  };
  return (
    <div id="learninfinnish">
      {/* Map through learning array and display each item */}
      <h1>English to finnish</h1>
      {learning.map((item, index) => (
        <div key={item.id}>
          {item.english} = {""}
          {/* {input to text quessing english word} */}
          <input
            type="text"
            value={quessFinnish[index]}
            onChange={(e) => handlequesses(index, e.target.value)}
          ></input>
        </div>
      ))}
    </div>
  );
}

export default LearnFinnish;
