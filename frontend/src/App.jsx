import React, { useState, useEffect } from "react";
import { Link, Route } from "react-router-dom";

function App() {
  let [learning, setLearning] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        //developing fetch
        // const response = await fetch("http://localhost:8080/api/learn");
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
      {" "}
      <div className="topnav">
        <Link to="/" className="active">
          Home
        </Link>
        <Link to="/learn-english">Learn English</Link>
        <Link to="/learn-finnish">Learn Finnish</Link>
      </div>
      <Route path="/" exact>
        <div id="learningenglish">
          {/* Map through learning array and display each item */}
          <h1>Suomesta englanniksi</h1>
          {learning.map((item) => (
            <div key={item.id}>
              {item.finnish} = {""} {item.english}
            </div>
          ))}
        </div>
      </Route>
      <Route path="/learn-finnish">
        <div id="learningfinnish">
          {/* Map through learning array and display each item */}
          <h1>English to Finnish</h1>
          {learning.map((item) => (
            <div key={item.id}>
              {item.english} = {""} {item.finnish}
            </div>
          ))}
        </div>
      </Route>
    </>
  );
}

export default App;
