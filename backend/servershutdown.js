/**
 * Gracefully shuts down the application by closing the MySQL connection.
 *
 * @param {object} pool - The MySQL connection pool.
 * @throws {Error} If there is an error closing the MySQL connection.
 * @returns {void}
 *
 * @function
 * @name gracefulShutdown
 * @global
 *
 * @example
 * // Example usage of gracefulShutdown
 * const pool = createMySqlConnectionPool();
 * gracefulShutdown(pool);
 */
const gracefulShutdown = (pool) => {
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

module.exports = gracefulShutdown;
