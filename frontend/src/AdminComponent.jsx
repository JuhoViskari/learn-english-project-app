import React, { useState } from "react";

// const response = await fetch("http://localhost:8080/api/learn");
// const response = await fetch("/api/learn");
const AdminPage = () => {
  const [english, setEnglish] = useState("");
  const [finnish, setFinnish] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  // styling Admin page
  const AboutPageStyle = {
    textAlign: "center",
    padding: "20px",
    border: "solid",
    backgroundColor: "lightgray",
  };

  // styling Admin page
  const AboutPageParagStyle = {
    textAlign: "center",
    padding: "20px",
    border: "solid",
    backgroundColor: "lightblue",
  };

  // handle input change if word is same
  // add value with state variable
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "finnish") {
      setFinnish(value);
    } else if (name === "english") {
      setEnglish(value);
    }
  };

  // HTTP POST TO ADD WORDS Functiondasd
  const PostWords = async () => {
    try {
      // if finnish and english have no text throw error
      if (!finnish || !english) {
        throw new Error("Finnish and English words are required");
      }

      // else show confirm alert to proceed
      const result = window.confirm(
        `Do you want to add Words with Finnish: ${finnish}, English: ${english}?`
      );

      // http fetch if result OK make http post
      if (result) {
        const response = await fetch(`/api/learn`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ finnish, english }),
        });

        // if hr not OK throw error
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // else add word succesfully show to user
        setMessage("Words added successfully");
        setError(null);
        console.log("Successful POST request");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error during POST request", error);
    }
  };

  return (
    <div>
      <h1 style={AboutPageStyle}>About Page</h1>
      <p style={AboutPageParagStyle}>
        <img
          src="https://homepages.tuni.fi/juho.viskari/loppu/koski.jpg"
          alt="Koski"
          style={{ maxWidth: "100%" }}
        />
        <br></br>
        Tässä on minun ottama kuva Tammerkoskesta keväällä 2023 copyright: Juho
        Viskari
      </p>
      <h1>ADD WORDS</h1>
      <input
        type="text"
        id={`finnish`}
        name={`finnish`}
        placeholder="Enter Finnish word"
        value={finnish}
        onChange={handleInputChange}
      />
      <br />
      <input
        type="text"
        id={`english`}
        name={`english`}
        placeholder="Enter English word"
        value={english}
        onChange={handleInputChange}
      />
      <br />
      <button onClick={PostWords}>Add Words</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>{message}</p>
    </div>
  );
};

export default AdminPage;
