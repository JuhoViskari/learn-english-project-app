import React, { useState, useEffect } from "react";

function LearnEnglish() {
  const [learning, setLearning] = useState([]);
  const [quessEnglish, setQuessEnglish] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [countCorrectAnswers, setCountCorrectAnswers] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        //developing fetch
        // const response = await fetch("http://localhost:8080/api/learn");
        const response = await fetch("/api/learn");
        const data = await response.json();
        setLearning(data);
        // Reset the current question when fetching new data
        setQuessEnglish(Array(data.length).fill(""));
        // reset correct answers when fetch new data
        setCountCorrectAnswers(0);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    // Call the fetchAll function to initiate data fetching
    fetchAll();
  }, []);

  // handle quess field
  const handlequesses = (index, value, item) => {
    const newGuesses = [...quessEnglish];
    newGuesses[index] = value;
    setQuessEnglish(newGuesses);

    // check is value correct or incorrect
    if (value.toLowerCase() === item.english.toLowerCase()) {
      setFeedback("Oikein");
      //increment correct answers
      setCountCorrectAnswers(countCorrectAnswers + 1);
    } else {
      setFeedback(`Väärin, oikeavastaus: ${item.english}`);
    }
  };
  return (
    <div id="learningenglish">
      {/* Map through learning array and display each item */}
      <h1>Suomesta englanniksi</h1>
      {learning.map((item, index) => (
        <div key={item.id}>
          {item.finnish} = {""}
          {/* Input englannin kysymyksen arvaamiseen */}
          <input
            type="text"
            value={quessEnglish[index]}
            onChange={(e) => handlequesses(index, e.target.value, item)}
          ></input>
          {/* Display total correct answers */}
          <p>Oikein vastatut: {countCorrectAnswers}</p>
          {/*show feedback correct wrong */}
          {feedback && <p>{feedback}</p>}
        </div>
      ))}
    </div>
  );
}

export default LearnEnglish;
