// Handle graceful shutdown
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
