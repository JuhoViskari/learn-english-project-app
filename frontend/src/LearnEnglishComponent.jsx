import React, { useState, useEffect } from "react";

function LearnEnglish() {
  const [learning, setLearning] = useState([]);
  const [quessEnglish, setQuessEnglish] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        //developing fetch
        const response = await fetch("http://localhost:8080/api/learn");
        // const response = await fetch("/api/learn");
        const data = await response.json();
        setLearning(data);
        // Reset the current question when fetching new data
        setQuessEnglish(Array(data.lenght).fill(""));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    // Call the fetchAll function to initiate data fetching
    fetchAll();
  }, []);

  // handle quess field
  const handlequesses = (index, value) => {
    const newGuesses = [...quessEnglish];
    newGuesses[index] = value;
    setQuessEnglish(newGuesses);
  };
  return (
    <div id="learningenglish">
      {/* Map through learning array and display each item */}
      <h1>Suomesta englanniksi</h1>
      {learning.map((item, index) => (
        <div key={item.id}>
          {item.finnish} = {""}
          {/* {input to text quessing english word} */}
          <input
            type="text"
            value={quessEnglish[index]}
            onChange={(e) => handlequesses(index, e.target.value)}
          ></input>
        </div>
      ))}
    </div>
  );
}

export default LearnEnglish;
