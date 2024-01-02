require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const mysql = require("mysql");
const app = express();
const gracefulShutdown = require("./servershutdown");
const config = require("./config");
const port = 8080;
var pool = mysql.createPool(config);

app.use(express.static("./frontend/dist"));

// make allow orgins * different server
app.use(cors());

// Define your route after the connection is established
app.get("/api/learn", (req, res) => {
  const findAllQuery = "SELECT * FROM learn;";

  pool.query(findAllQuery, (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});
// get by id
app.get("/api/learn/:myId([0-9]+)", (req, res) => {
  // get value from URL parameter
  const myId = req.params.myId;
  const findByIdQuery = `SELECT * FROM learn where id = ?`;

  pool.query(findByIdQuery, [myId], (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(404).json({ msg: err });
    } else {
      res.status(200).json(results);
    }
  });
});

// DELETE
app.delete("/api/learn/:myId([0-9]+)", (req, res) => {
  // get value from URL parameter
  const myId = req.params.myId;
  const deleteByIdQuery = `DELETE FROM learn WHERE id = ?`;

  pool.query(deleteByIdQuery, [myId], (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal Server Error" });
      // check if result object is sql affect rows are 0 not found
    } else if (results.affectedRows === 0) {
      res.status(404).json({ msg: "Not Found" });
    } else {
      res.status(200).json({ msg: "Deleted successfully" });
    }
  });
});

// HTTP POST function
app.post("/api/learn", express.json(), (req, res) => {
  const { finnish, english } = req.body;

  const postTaskQuery = "INSERT INTO learn (finnish, english) VALUES (?, ?)";

  pool.query(postTaskQuery, [finnish, english], (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      // making learning object where is database rows
      const learning = {
        id: results.insertId,
        finnish,
        english,
      };
      res.status(201).json({ msg: "Created successfully", learning });
    }
  });
});

app.patch("/api/learn/:myId([0-9]+)", express.json(), (req, res) => {
  const myId = req.params.myId;
  const { english, finnish } = req.body;

  const updateQuery = `UPDATE learn SET finnish = ?, english = ? WHERE id = ?`;

  pool.query(
    updateQuery,
    [finnish, english, myId],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ msg: "Not Found" });
      } else {
        res.status(200).json({ msg: "modified successfully" });
      }
    }
  );
});
// Start the server
const server = app
  .listen(port, () => {
    console.log(`SERVER: listening on port ${port}.`);
    console.log(process.env); // ADD THIS!!
  })
  .on("error", (err) => {
    console.error("SERVER: Error starting server: ", err);
    process.exit(1);
  });

process.on("SIGTERM", () => gracefulShutdown(pool)); // Some other app requires shutdown.
process.on("SIGINT", () => gracefulShutdown(pool)); // ctrl-c
