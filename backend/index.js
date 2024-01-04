/**
 * Require necessary modules and configure environment.
 */
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
/**
 * Serve static files from the frontend/dist directory.
 */
app.use(express.static("./frontend/dist"));

// make allow orgins * different server
app.use(cors());
/**
 * Define a route to get all records from the 'learn' table.
 *
 * @route GET /api/learn
 * @returns {object} The JSON representation of all records in the 'learn' table.
 * @throws {object} Internal Server Error if a database error occurs.
 */
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
/**
 * Define a route to get a record by ID from the 'learn' table.
 *
 * @route GET /api/learn/:myId
 * @param {number} myId - The ID of the record to retrieve.
 * @returns {object} The JSON representation of the requested record.
 * @throws {object} Not Found if the record with the given ID does not exist.
 */
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
/**
 * Define a route to delete a record by ID from the 'learn' table.
 *
 * @route DELETE /api/learn/:myId
 * @param {number} myId - The ID of the record to delete.
 * @returns {object} The JSON representation of the requested record.
 * @throws {object} Not Found if the record with the given ID does not exist.
 * @throws {object} Internal Server Error if a database error occurs during
 * the deletion.
 */
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

/**
 * Define a route to add a new record to the 'learn' table.
 *
 * @route POST /api/learn
 * @param {object} req.body - The request body containing the data for the new record.
 * @param {string} req.body.finnish - The Finnish language content for the new record.
 * @param {string} req.body.english - The English language content for the new record.
 * @returns {object} The JSON representation of the newly created record.
 * @throws {object} Internal Server Error if a database error occurs during the insertion.
 */
app.post("/api/learn", express.json(), (req, res) => {
  const { finnish, english } = req.body;

  const postTaskQuery = "INSERT INTO learn (finnish, english) VALUES (?, ?)";

  pool.query(postTaskQuery, [finnish, english], (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      // Creating a learning object with database rows
      const learning = {
        id: results.insertId,
        finnish,
        english,
      };
      res.status(201).json({ msg: "Created successfully", learning });
    }
  });
});

/**
 * Define a route to update a record by ID in the 'learn' table.
 *
 * @route PATCH /api/learn/:myId
 * @param {number} req.params.myId - The ID of the record to update.
 * @param {object} req.body - The request body containing the data for the update.
 * @param {string} req.body.english - The updated English language content.
 * @param {string} req.body.finnish - The updated Finnish language content.
 * @returns {object} The JSON representation of the updated record.
 * @throws {object} Internal Server Error if a database error occurs during the update.
 * @throws {object} Not Found if the record with the given ID does not exist.
 */
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
/**
 * Start the server and handle errors.
 */
const server = app
  .listen(port, () => {
    console.log(`SERVER: listening on port ${port}.`);
    console.log(process.env); // ADD THIS!!
  })
  .on("error", (err) => {
    console.error("SERVER: Error starting server: ", err);
    process.exit(1);
  });
/**
 * Gracefully handle SIGTERM and SIGINT signals for server shutdown.
 */
process.on("SIGTERM", () => gracefulShutdown(pool)); // Some other app requires shutdown.
process.on("SIGINT", () => gracefulShutdown(pool)); // ctrl-c
