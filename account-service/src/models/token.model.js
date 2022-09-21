const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const schema = mongoose.Schema(
  {
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    activeToken: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(toJSON);

const Token = mongoose.model("Token", schema);

module.exports = Token;
