const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "MYNAMEISASHISH";

const blog = new mongoose.Schema({
  userID: {
    type: String,
  },
  publishDate: {
    type: Date,
  },
  publisher: {
    type: String,
  },

  title: {
    type: String,
  },
  content: {
    type: String,
  },
  catagory: {
    type: String,
  },
  imgurl: {
    type: String,
  
  },
  
});

const blogModel = mongoose.model("blog", blog);

module.exports = blogModel;
