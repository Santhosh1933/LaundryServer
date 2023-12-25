const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, require: true, unique: true },
  password: { type: String, required: true },
  notificationToken: { type: String, default: null },
  registerNumber: { type: String, require: true, unique: true },
});

module.exports = mongoose.model("user", userSchema);
