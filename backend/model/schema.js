const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  userimage: {
    type: String,
  },
});

user.pre("save", async function (next) {
  console.log("hi from user");
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const userModel = mongoose.model("userdata", user);

module.exports = userModel;
