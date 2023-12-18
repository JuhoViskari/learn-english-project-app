require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mysql = require("mysql");
const app = express();
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
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
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

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log("Starting graceful shutdown...");
  // Try to close the server and database connection
  pool.end((err) => {
    if (err) {
      console.error("MYSQL: Error closing MySQL connection: ", err);
    } else {
      console.log("MySQL: Connection closed");
    }
    console.log("APPLICATION: Shutdown complete");
    process.exit(1);
  });
};

process.on("SIGTERM", gracefulShutdown); // Some other app requires shutdown.
process.on("SIGINT", gracefulShutdown); // ctrl-c
