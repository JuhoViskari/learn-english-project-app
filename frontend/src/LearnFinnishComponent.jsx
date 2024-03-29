import React, { useState, useEffect } from "react";
/**
 * LearnFinnish component for user to learn Finnish
 *
 * @component
 * @description This have same documentations with LearnEnglish Component
 * only that there is english and finnish items different way
 *
 * // Usage of LearnEnglish component
 * <LearnEnglish />
 *
 * @returns {JSX.Element} The JSX representation of the LearnEnglish component.
 */
function LearnFinnish() {
  const [learning, setLearning] = useState([]);
  const [quessFinnish, setQuessFinnish] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [countCorrectAnswers, setCountCorrectAnswers] = useState([]);
  // total count of questions
  const TotalQuestions = learning.length;
  useEffect(() => {
    const fetchAll = async () => {
      try {
        //developing fetch
        // const response = await fetch("http://localhost:8080/api/learn");
        const response = await fetch("/api/learn");
        const data = await response.json();
        // call randomized data
        const shuffledLearning = shuffle(data);
        // intialize 10 limit
        const showTenItems = shuffledLearning.slice(0, 10);
        setLearning(showTenItems);
        // Reset the current question when fetching new random data
        setQuessFinnish(Array(showTenItems.length).fill(""));
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
  const handlequesses = (index, value) => {
    const newGuesses = [...quessFinnish];
    newGuesses[index] = value;
    setQuessFinnish(newGuesses);
  };
  // check is value correct or incorrect map item and index
  const handleCheckButton = () => {
    const newFeedback = learning.map((item, index) => {
      const value = quessFinnish[index].toLowerCase();
      if (value === item.finnish.toLowerCase()) {
        //increment correct answers
        setCountCorrectAnswers(countCorrectAnswers + 1);
        return "✅";
      } else {
        return `❌ ${item.finnish}`;
      }
    });

    // state variable get parameter newFeedBack
    setFeedback(newFeedback);
    // if fb === with correct answers filter lenght
    const newCountCorrectAnswers = newFeedback.filter(
      (fb) => fb === "✅"
    ).length;
    setCountCorrectAnswers(newCountCorrectAnswers);
  };

  // randomize words to quess
  const shuffle = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  return (
    <div id="learningenglish">
      <h1>English to Finnish</h1>
      {/* Map through learning array and display each item */}
      {learning.map((item, index) => (
        <div key={item.id} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "10px" }}>{item.english}</div>
          {/* Input to guess */}
          <input
            type="text"
            id={`questin-${index}`}
            name={`question-${index}`}
            value={quessFinnish[index]}
            onChange={(e) => handlequesses(index, e.target.value, item)}
          />
          <span style={{ marginLeft: "10px" }}>{feedback[index]}</span>
          {/* Display total correct answers */}
          {/*show feedback correct wrong */}
        </div>
      ))}
      <button onClick={handleCheckButton}>Check</button>
      <p>
        Correct answers: {countCorrectAnswers}/{TotalQuestions}
      </p>
      <p style={{ fontSize: "50px" }}>
        {countCorrectAnswers === 0
          ? " "
          : countCorrectAnswers < 5
          ? "😵‍💫"
          : countCorrectAnswers < 10
          ? "😎"
          : "🎉🤩"}
      </p>
    </div>
  );
}

export default LearnFinnish;
