import React from "react";

const AdminPage = () => {
  const AboutPageStyle = {
    textAlign: "center",
    padding: "20px",
    border: "solid",
    backgroundColor: "lightgray",
  };

  const AboutPageParagStyle = {
    textAlign: "center",
    padding: "20px",
    border: "solid",
    backgroundColor: "lightblue",
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
    </div>
  );
};

export default AdminPage;
