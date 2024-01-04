import React, { useState, useEffect } from "react";
/**
 * LearnEnglish component for user to learn English
 *
 * @component
 * @example
 * // Usage of LearnEnglish component
 * <LearnEnglish />
 *
 * @returns {JSX.Element} The JSX representation of the LearnEnglish component.
 */
function LearnEnglish() {
  const [learning, setLearning] = useState([]);
  const [quessEnglish, setQuessEnglish] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [countCorrectAnswers, setCountCorrectAnswers] = useState([]);
  // total count of questions
  const TotalQuestions = learning.length;

  /**
   * useEffect hook to fetch learning data when the component mounts.
   */
  useEffect(() => {
    /**
     * Fetch all learning data from the server and randomize data and
     * showing 10 words.
     *
     * @async
     * @function
     * @name fetchAll
     * @throws {Error} If there is an error fetching data.
     */
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
        setQuessEnglish(Array(showTenItems.length).fill(""));
        // reset correct answers when fetch new data
        setCountCorrectAnswers(0);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    // Call the fetchAll function to initiate data fetching
    fetchAll();
  }, []);

  /**
   * Update the user's guesses for the English translations of displayed words.
   *
   * @function
   * @name handlequesses
   * @param {number} index - The index of the word in the displayed list.
   * @param {string} value - The user's guess for the English translation.
   * @returns {void} This function does not return a value.
   */
  const handlequesses = (index, value) => {
    // copy current guess array
    const newGuesses = [...quessEnglish];
    // Update the guess to specific word
    newGuesses[index] = value;
    setQuessEnglish(newGuesses);
  };
  /**
   * Check user guesses are it's correct and give feedback
   *
   * @function
   * @name handleCheckButton
   * @param {number} index - The index of the word in the displayed list.
   * @param {string} value - The user's guess for the English translation.
   * @returns {Array<string>} An array containing feedback for each word.
   */
  // check is value correct or incorrect map item and index
  const handleCheckButton = () => {
    const newFeedback = learning.map((item, index) => {
      // user guess for correct answer convert lowercase
      const value = quessEnglish[index].toLowerCase();
      // check is user guess correct
      if (value === item.english.toLowerCase()) {
        //increment count of correct answers
        setCountCorrectAnswers(countCorrectAnswers + 1);
        // feedbacks for correct answers if wrong give correct answer
        return "✅";
      } else {
        return `❌ ${item.english}`;
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

  /**
   * Randomize the order of elements in an array using the Fisher-Yates shuffle algorithm.
   *
   * @function
   * @name shuffle
   * @param {Array} array - The array to be shuffled.
   * @returns {Array} A new array with elements in a randomized order.
   */
  const shuffle = (array) => {
    //copy of array modifying original array
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      // randomise
      const j = Math.floor(Math.random() * (i + 1));
      // swap element at indices i and j
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  return (
    <div id="learningenglish">
      <h1>Suomesta englanniksi</h1>
      {/* Map through learning array and display each item */}
      {learning.map((item, index) => (
        <div key={item.id} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "10px" }}>{item.finnish}</div>
          {/* Input to guess */}
          <input
            type="text"
            id={`questin-${index}`}
            name={`question-${index}`}
            value={quessEnglish[index]}
            onChange={(e) => handlequesses(index, e.target.value, item)}
          />
          <span style={{ marginLeft: "10px" }}>{feedback[index]}</span>
          {/* Display total correct answers */}
          {/*show feedback correct wrong */}
        </div>
      ))}
      <button onClick={handleCheckButton}>Tarkista</button>
      <p>
        Oikein vastatut: {countCorrectAnswers}/{TotalQuestions}
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

export default LearnEnglish;
