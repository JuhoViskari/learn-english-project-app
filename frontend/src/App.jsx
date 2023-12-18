import React, { useState, useEffect } from "react";

function App() {
  let [learning, setLearning] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // const response = await fetch("http://localhost:8080/api/learn"); developing
        const response = await fetch("/api/learn");
        const data = await response.json();
        setLearning(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    // Call the fetchAll function to initiate data fetching
    fetchAll();
  }, []);

  return (
    <>
      <div id="learningenglish">
        {/* Map through learning array and display each item */}
        <h1>Suomesta englanniksi</h1>
        {learning.map((item) => (
          <div key={item.id}>
            {item.finnish} = {""} {item.english}
          </div>
        ))}
      </div>
      <div id="learningfinnish">
        {/* Map through learning array and display each item */}
        <h1>English to finnish</h1>
        {learning.map((item) => (
          <div key={item.id}>
            {item.english} = {""} {item.finnish}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
