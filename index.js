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
  console.log(`Server is running on ${port}`);
});
