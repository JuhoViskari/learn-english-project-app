import React, { useState, useEffect } from "react";

// const response = await fetch("http://localhost:8080/api/learn");
// const response = await fetch("/api/learn");

/**
 * AdminPage component for managing and displaying words in the 'learn' table.
 *
 * @component
 * @example
 * // Usage of AdminPage component
 * <AdminPage />
 *
 * @returns {JSX.Element} The JSX representation of the AdminPage component.
 */
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  /**
   * useEffect hook to fetch learning data when the component mounts.
   */
  useEffect(() => {
    /**
     * Fetch all learning data from the server.
     *
     * @async
     * @function
     * @name fetchAll
     * @throws {Error} If there is an error fetching data.
     */
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
  /**
   * Check that both inputs have words or letters and update state
   *
   *
   * @function
   * @name handleInputChange
   * @param {object} event - The input change event.
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "finnish") {
      setFinnish(value);
    } else if (name === "english") {
      setEnglish(value);
    } else if (name === "editedFinnish") {
      setEditedFinnish(value);
    } else if (name === "editedEnglish") {
      setEditedEnglish(value);
    }
  };
  /**
   * Perform a POST request to add words to the 'learn' table.
   *
   * @async
   * @function
   * @name PostWords
   * @throws {Error} If Finnish and English words are not provided.
   * @throws {Error} If there is an HTTP error during the request.
   * @returns {Promise<void>} A Promise that resolves when the POST request
   * is completed successfully.
   */
  const PostWords = async () => {
    try {
      // if finnish and english have no text throw error
      if (!finnish || !english) {
        throw new Error("Both Finnish and English words are required");
      }

      // else show confirm alert to proceed
      const result = window.confirm(
        `Do you want to add Words with Finnish: ${finnish}, English: ${english}?`
      );

      // http fetch if user confirm OK make http post
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

  /**
   * Perform a DELETE request to delete words from the 'learn' table.
   *
   * @async
   * @function
   * @name DeleteData
   * @param {number} id - ID of the record to be deleted.
   * @param {string} finnish - Delete finnish content of the record
   * @param {string} english - Delete english content of the record
   * @throws {Error} If there is an error deleting data.
   * @returns {Promise<void>} A Promise that resolves when the DELETE request
   * is completed successfully.
   */
  const DeleteData = async (id, finnish, english) => {
    try {
      // show confirm delete
      const confirmDelete = window.confirm(
        `Do you want to delete Finnish: ${finnish}, English: ${english}?`
      );
      // if user confirm delete by id
      if (confirmDelete) {
        await fetch(`/api/learn/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        // tell user deleted succesfully
        setDeleteMessage("Word deleted successfully");
        // fetch all after delete
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
  /**
   * Modify data in the 'learn' table using a PATCH request.
   *
   * @async
   * @function
   * @name ModifyData
   * @param {number} id - The ID of the record to be modified.
   * @param {string} finnish - Update finnish content of the record
   * @param {string} english - Update english content of the record
   * @throws {Error} If there is an error modifying data.
   * @returns {Promise<void>} A Promise that resolves when the PATCH request
   * is completed successfully.
   */
  const ModifyData = async (id, finnish, english) => {
    try {
      // show confirm new values
      const confirmPatch = window.confirm(
        `Do you want to change ${finnish}, English ${english}`
      );
      // if new records are ok update new values
      if (confirmPatch) {
        await fetch(`/api/learn/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            finnish,
            english,
          }),
        });

        // Disable edit mode after modifying data
        setEditMode(null);
        // fetch all after update
        const response = await fetch("/api/learn");
        const data = await response.json();
        setLearning(data);
        setQuessFinnish(Array(data.length).fill(""));
      }
    } catch (error) {
      console.error("Error modifying data:", error);
    }
  };
  /**
   * Toggle edit mode for a specific record.
   *
   * @function
   * @name toggleEditMode
   * @param {number} index - The index of the record to toggle edit mode.
   * @returns {void} This function does not return a value.
   */
  const toggleEditMode = (index) => {
    setEditMode(editMode === index ? null : index);
    setEditedFinnish("");
    setEditedEnglish("");
  };

  /**
   * Functional component for handling user login.
   *
   * @function
   * @name Login
   * @returns {JSX.Element} The login form or the Admin Page if already logged in.
   */
  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      setLoggedIn(true);
    } else {
      alert("Invalid username or password");
    }
  };
  // check if user is not logged in show username and password inputs
  if (!loggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Login to Admin Page</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }
  return (
    <div>
      <h1 style={AboutPageStyle}>Admin Page</h1>
      <div style={AboutPageParagStyle} id="admin-fetch">
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
                  value={editedFinnish !== "" ? editedFinnish : item.finnish}
                  onChange={handleInputChange}
                />
                <br />
                <input
                  type="text"
                  id={`editedEnglish`}
                  name={`editedEnglish`}
                  placeholder="Edit English word"
                  value={editedEnglish !== "" ? editedEnglish : item.english}
                  onChange={handleInputChange}
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
      <p style={{ textAlign: "center", color: "green", fontSize: "20px" }}>
        {Deletemessage}
      </p>
      <h1 style={{ fontSize: "20px", textAlign: "center" }}>ADD WORDS</h1>
      <input
        style={{
          margin: "0 auto",
          display: "block",
        }}
        type="text"
        id={`finnish`}
        name={`finnish`}
        placeholder="Enter Finnish word"
        value={finnish}
        onChange={handleInputChange}
      />
      <br />
      <input
        style={{
          margin: "0 auto",
          display: "block",
        }}
        type="text"
        id={`english`}
        name={`english`}
        placeholder="Enter English word"
        value={english}
        onChange={handleInputChange}
      />
      <br />
      <button
        style={{
          margin: "0 auto",
          display: "block",
        }}
        onClick={PostWords}
      >
        Add Words
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>{message}</p>
    </div>
  );
};

export default AdminPage;
