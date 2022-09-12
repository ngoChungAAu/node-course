const express = require("express");
const User = require("../models/user");
const userRouter = new express.Router();

userRouter.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    res.status(201).send(user);
  } catch (err) {
    if (err.errors) {
      const field = Object.keys(err.errors);
      return res.status(400).send(err.errors[`${field}`].message);
    }

    res.send(err);
  }
});

userRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

userRouter.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("Not found user!");
    }

    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

userRouter.patch("/users/:id", async (req, res) => {
  const updateFields = ["name", "email", "password", "age"];
  const fields = Object.keys(req.body);
  const isFields = fields.every((e) => updateFields.includes(e));

  if (!isFields) {
    return res.status(400).send({ error: "Invalid update fields!" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).send("Not found user!");
    }

    res.send(user);
  } catch (err) {
    if (err.errors) {
      const field = Object.keys(err.errors);
      return res.status(400).send(err.errors[`${field}`].message);
    }

    res.send(err);
  }
});

userRouter.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send("Not found user!");
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = userRouter;
