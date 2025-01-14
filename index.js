const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
const port = process.env.PORT;

app.use(express.json);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
