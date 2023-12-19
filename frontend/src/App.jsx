import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PropTypes from "prop-types";

function LearnEnglish({ learning }) {
  return (
    <div id="learningenglish">
      {/* Map through learning array and display each item */}
      <h1>Suomesta englanniksi</h1>
      {learning.map((item) => (
        <div key={item.id}>
          {item.finnish} = {""} {item.english}
        </div>
      ))}
    </div>
  );
}
LearnEnglish.propTypes = {
  learning: PropTypes.array.isRequired,
};

function LearnFinnish({ learning }) {
  return (
    <div id="learningfinnish">
      {/* Map through learning array and display each item */}
      <h1>English to Finnish</h1>
      {learning.map((item) => (
        <div key={item.id}>
          {item.english} = {""} {item.finnish}
        </div>
      ))}
    </div>
  );
}

LearnFinnish.propTypes = {
  learning: PropTypes.array.isRequired,
};
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
    <Router>
      <div className="topnav">
        <Link to="/" className="active">
          Learn English
        </Link>
        <Link to="/learn-finnish">Learn Finnish</Link>
        <Link to="/admin">Admin</Link>
      </div>

      <Routes>
        <Route path="/" element={<LearnEnglish learning={learning} />} />
        <Route
          path="/learn-finnish"
          element={<LearnFinnish learning={learning} />}
        />
        {/* <Route path="/admin" element={<LearnEnglish learning={learning} />} /> */}
      </Routes>
    </Router>
  );
}
export default App;
