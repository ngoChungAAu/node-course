const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const taskRouter = new express.Router();

taskRouter.post("/task", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    userID: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    if (e.errors) {
      const field = Object.keys(e.errors);
      return res.status(400).send(e.errors[field].message);
    }

    res.send({ msg: e.message });
  }
});

taskRouter.get("/task/list", auth, async (req, res) => {
  // filter
  const match = {};
  // pagination
  const size = 0;
  const page = 0;
  // sort
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.size) {
    size = parseInt(req.query.size);
  }

  if (req.query.page) {
    page = parseInt(req.query.page);
  }

  if (req.query.createdAt) {
    sort.createdAt = req.query.createdAt === "asc" ? 1 : -1;
  }

  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: { limit: size, skip: size * page, sort },
    });

    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

taskRouter.get("/task/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userID: req.user._id,
    });

    if (!task) {
      return res.status(404).send("Task not found");
    }

    res.send(task);
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

taskRouter.patch("/task/:id", auth, async (req, res) => {
  const updateFields = ["description", "completed"];
  const fields = Object.keys(req.body);
  const isFields = fields.every((e) => updateFields.includes(e));

  if (!isFields) {
    return res.status(400).send({ error: "Invalid update fields!" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userID: req.user._id,
    });

    if (!task) {
      return res.status(404).send("Task not found");
    }

    fields.forEach((e) => (task[e] = req.body[e]));

    await task.save();

    res.send(task);
  } catch (e) {
    if (e.errors) {
      const field = Object.keys(e.errors);
      return res.status(400).send(e.errors[field].message);
    }

    res.send({ msg: e.message });
  }
});

taskRouter.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userID: req.user._id,
    });

    if (!task) {
      res.status(404).send("Task not found");
    }

    res.send("Delete task successfully!");
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

module.exports = taskRouter;
