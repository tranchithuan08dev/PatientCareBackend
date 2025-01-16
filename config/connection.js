const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: process.env.HOST,
  database: "TheSystemDoctor",
  password: "123",
  port: 5432,
});

pool
  .connect()
  .then(() => {
    console.log("Connected to the database successfully!");
  })
  .catch((err) => {
    console.error("Connection failed: ", err.stack);
  });

module.exports = pool;
