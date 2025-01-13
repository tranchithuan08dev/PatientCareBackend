const express = require("express");
const app = express();
const dotenv = require("dotenv");
const port = 5000;
dotenv.config();
app.get("/", function (req, res) {
  res.send("Hello World11111111121423423");
});

console.log(port);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
