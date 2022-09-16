const express = require("express");
// .env
require("dotenv").config();
// connect to DB
require("./db/mongoose");
// router
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

const multer = require("multer");

const upload = multer({
  dest: "images",
  limits: {
    fileSize: 500000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error("Must be image file"));
    }

    callback(undefined, true);
  },
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.send(200);
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
