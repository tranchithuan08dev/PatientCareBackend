const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;

app.get("/", (req, res) => {
  console.log("Server is starting... he1lo");
  res.send("Hello word ");
});

console.log(port);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
