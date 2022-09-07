const express = require("express");

const app = express();
const port = 3000;

app.use(express.static("public"));

console.log(__dirname);
console.log(app.use(express.static("public")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/help", (req, res) => {
  res.send("Help page");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
