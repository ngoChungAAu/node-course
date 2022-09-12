const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017";

mongoose.connect(`${uri}/task-manager-api`);
