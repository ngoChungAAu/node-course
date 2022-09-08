const express = require("express");
const path = require("path");
const hbs = require("hbs");

const app = express();
const port = 3000;

const publicFolder = path.join(__dirname, "../public");
const partialsFolder = path.join(__dirname, "../views/partials");

// if there is no views folder in root
// const viewsFolder = path.join(__dirname, "../public");
// app.set("views", viewsFolder);

app.use(express.static(publicFolder));

app.set("view engine", "hbs");
hbs.registerPartials(partialsFolder);

app.get("/", (req, res) => {
  res.render("layouts/index", {
    title: "Weather",
    name: "Andrew Mead",
  });
});

app.get("/about", (req, res) => {
  res.render("layouts/about", {
    title: "About Me",
    name: "Andrew Mead",
  });
});

app.get("/help", (req, res) => {
  res.render("layouts/help", {
    helpText: "This is some helpful text.",
    title: "Help",
    name: "Andrew Mead",
  });
});

// query string
app.get("/weather", (req, res) => {
  if (!req.query.where) {
    res.send({ error: "must query string 'where'" });
  } else {
    res.send({
      forecast: "It is snowing",
      location: "Hanoi",
    });
  }
});

// not found
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Andrew Mead",
    errorMessage: "Page not found.",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
