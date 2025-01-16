const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const RouterAPI = require("./API/routers/index.route");
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json()); // Body parser for JSON requests

const port = process.env.PORT;
app.use(cors());
app.use(cookieParser());

RouterAPI(app);
app.listen(port, () => {
  console.log("Environment Variables:");
  console.log("DB_USER:", process.env.DB_USER);
  console.log("DB_PASS:", process.env.DB_PASS);
  console.log("DB_HOST:", process.env.HOST);
  console.log("DB_PORT:", process.env.DB_PORT);

  console.log(`Server is running on ${port}`);
});
