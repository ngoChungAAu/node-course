const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const userRouter = new express.Router();

// register
userRouter.post("/user/register", async (req, res) => {
  const user = new User(req.body);

  try {
    const count = await User.countDocuments({ email: user.email });

    if (count > 0) {
      return res.status(400).send("registered!");
    }

    await user.save();

    res.status(201).send(user);
  } catch (err) {
    if (err.errors) {
      const field = Object.keys(err.errors);
      return res.status(400).send(err.errors[field].message);
    }

    res.send({ msg: err.message });
  }
});

// login
userRouter.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, error } = await User.findByCredentials(email, password);

    if (!user) {
      return res.status(401).send({
        error: error.message,
      });
    }

    const access_token = await user.generateAuthToken();

    if (!access_token) {
      return res.status(401).send({
        error: "Login failed!",
      });
    }

    res.status(201).send({ access_token });
  } catch (err) {
    res.send({ msg: err.message });
  }
});

// get list users
userRouter.get("/user/list", auth, async (req, res) => {
  const { role } = req.user;

  if (role === "user") {
    return res.status(401).send({ error: "Only admin !!!" });
  }

  try {
    const users = await User.find({});

    users.map((e) => e.publicData());

    res.send(users);
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

// get user profile
userRouter.get("/user/profile", auth, async (req, res) => {
  res.send(req.user.publicData());
});

// get user detail by id
userRouter.get("/user/:id", auth, async (req, res) => {
  const { role } = req.user;

  if (role === "user") {
    return res.status(401).send({ error: "Only admin !!!" });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("Not found user!");
    }

    res.send(user.publicData());
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
});

// update user
userRouter.patch("/user/update", auth, async (req, res) => {
  const updateFields = ["name", "age"];
  const fields = Object.keys(req.body);
  const isFields = fields.every((e) => updateFields.includes(e));

  if (!isFields) {
    return res.status(400).send({ error: "Invalid update fields!" });
  }

  try {
    fields.forEach((e) => (req.user[e] = req.body[e]));

    await req.user.save();

    res.send(req.user.publicData());
  } catch (err) {
    if (err.errors) {
      const field = Object.keys(err.errors);
      return res.status(400).send(err.errors[field].message);
    }

    res.send({ msg: err.message });
  }
});

// change password
userRouter.patch("/user/change-password", auth, async (req, res) => {
  const password = req.body.password;

  try {
    req.user.password = password;

    await req.user.save();

    res.status(200).send("Change password successfully!");
  } catch (err) {
    if (err.errors) {
      const field = Object.keys(err.errors);
      return res.status(400).send(err.errors[field].message);
    }

    res.send({ msg: err.message });
  }
});

// update role
userRouter.patch("/user/update/:id", auth, async (req, res) => {
  const { role } = req.user;

  if (role === "user") {
    return res.status(401).send({ error: "Only admin !!!" });
  }

  try {
    const user = await User.findById(req.params.id);

    if (user.role === "admin") {
      user.role = "user";
    } else {
      user.role = "admin";
    }

    await user.save();

    res.send(req.user.publicData());
  } catch (err) {
    if (err.errors) {
      const field = Object.keys(err.errors);
      return res.status(400).send(err.errors[field].message);
    }

    res.send({ msg: err.message });
  }
});

// delete user by id
userRouter.delete("/user/:id", auth, async (req, res) => {
  const { role } = req.user;

  if (role === "user") {
    return res.status(401).send({ error: "Only admin !!!" });
  }

  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send("Not found user!");
    }

    res.status(200).send("Delete successfully!");
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

// logout one
userRouter.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });

    await req.user.save();

    res.send("Logout successfully!");
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

// logout all
userRouter.post("/user/logout/all", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send("Logout all successfully!");
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

module.exports = userRouter;
