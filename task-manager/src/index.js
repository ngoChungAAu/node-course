const express = require("express");
require("./db/mongoose");
const User = require("./models/user.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => res.send(user))
    .catch((err) => {
      if (err.errors) {
        const field = Object.keys(err.errors);
        res.status(400).send(err.errors[`${field}`].message);
      } else res.send(err);
    });
});

app.get("/users", (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res.send(err);
    });
});

app.get("/users/:id", (req, res) => {
  const _id = req.params.id;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        res.status(404).send("Not found user!");
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
