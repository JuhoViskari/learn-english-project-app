import React, { useState, useEffect } from "react";

// const response = await fetch("http://localhost:8080/api/learn");
// const response = await fetch("/api/learn");
const AdminPage = () => {
  const [english, setEnglish] = useState("");
  const [finnish, setFinnish] = useState("");
  const [message, setMessage] = useState("");
  const [Deletemessage, setDeleteMessage] = useState("");
  const [error, setError] = useState(null);
  const [learning, setLearning] = useState([]);
  const [quessFinnish, setQuessFinnish] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedFinnish, setEditedFinnish] = useState("");
  const [editedEnglish, setEditedEnglish] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        //fetch
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

  // styling Admin page
  const AboutPageStyle = {
    textAlign: "center",
    padding: "20px",
    border: "solid",
    backgroundColor: "lightgray",
  };

  // styling Admin page
  const AboutPageParagStyle = {
    height: "350px",
    width: "350px",
    border: " 1px solid #ccc",
    font: "16px/26px Georgia",
    Garamond: "Serif",
    overflow: "auto",
    margin: "auto",
    position: "top",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
  };

  const handleFinnishChange = (event) => {
    const { value } = event.target;
    // this should do to prevent that input field does not empty if user
    // dont give any value
    setEditedFinnish((prevValue) => (value !== "" ? value : prevValue));
  };

  const handleEnglishChange = (event) => {
    const { value } = event.target;
    // this should do to prevent that input field does not empty if user
    // dont give any value
    setEditedEnglish((prevValue) => (value !== "" ? value : prevValue));
  };

  // check that both inputs have words or letter
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "finnish") {
      setFinnish(value);
    } else if (name === "english") {
      setEnglish(value);
    }
  };

  // HTTP POST TO ADD WORDS Function
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

        // if response not OK throw error
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // else add word succesfully show to user
        setMessage("Words added successfully");
        setError(null);
        console.log("Successful POST request");

        // Fetch the updated data after succesful post
        const fetchDataResponse = await fetch("/api/learn");
        const updatedData = await fetchDataResponse.json();
        setLearning(updatedData);
        // Reset
        setQuessFinnish(Array(updatedData.length).fill(""));
      }
    } catch (error) {
      setError(error.message);
      console.error("Error during POST request", error);
    }
  };
  // DeleteData
  const DeleteData = async (id, finnish, english) => {
    try {
      // show confirm delete
      const confirmDelete = window.confirm(
        `Do you want to delete Finnish: ${finnish}, English: ${english}?`
      );
      if (confirmDelete) {
        await fetch(`/api/learn/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setDeleteMessage("Word deleted successfully");
        const response = await fetch("/api/learn");
        const data = await response.json();
        setLearning(data);
        // clear the selected task
        setQuessFinnish(Array(data.length).fill(""));
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const ModifyData = async (id, originalFinnish, originalEnglish) => {
    try {
      const confirmPatch = window.confirm(
        `Do you want to change ${finnish}, English ${english}`
      );
      if (confirmPatch) {
        await fetch(`/api/learn/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            finnish: editedFinnish || originalFinnish,
            english: editedEnglish || originalEnglish,
          }),
        });

        setEditMode(null); // Disable edit mode after modifying data

        const response = await fetch("/api/learn");
        const data = await response.json();
        setLearning(data);
        setQuessFinnish(Array(data.length).fill(""));
      }
    } catch (error) {
      console.error("Error modifying data:", error);
    }
  };

  const toggleEditMode = (index) => {
    setEditMode(editMode === index ? null : index);
  };
  return (
    <div>
      <h1 style={AboutPageStyle}>Admin Page</h1>

      <p style={AboutPageParagStyle}>
        <div id="admin-fetch">
          {/* Map through learning array and display each item */}
          {learning.map((item, index) => (
            <div key={item.id}>
              {editMode === index ? (
                // Input area for editing
                <>
                  <input
                    type="text"
                    id={`editedFinnish`}
                    name={`editedFinnish`}
                    placeholder="Edit Finnish word"
                    value={editedFinnish || item.finnish}
                    onChange={handleFinnishChange}
                  />
                  <br />
                  <input
                    type="text"
                    id={`editedEnglish`}
                    name={`editedEnglish`}
                    placeholder="Edit English word"
                    value={editedEnglish || item.english}
                    onChange={handleEnglishChange}
                  />
                  <br />
                  <button
                    className="btn"
                    onClick={() =>
                      ModifyData(item.id, editedFinnish, editedEnglish)
                    }
                  >
                    Save
                  </button>
                </>
              ) : (
                // Display area
                <>
                  {item.finnish} = {item.english}{" "}
                  <button
                    className="btn"
                    onClick={() =>
                      DeleteData(item.id, item.finnish, item.english)
                    }
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                  <button className="btn" onClick={() => toggleEditMode(index)}>
                    <i className="fa fa-edit"></i>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </p>
      <p style={{ textAlign: "center", color: "green", fontSize: "20px" }}>
        {Deletemessage}
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
