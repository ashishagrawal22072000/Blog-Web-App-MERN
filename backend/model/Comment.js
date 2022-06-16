const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  blogId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  comment: {
    type: String,
    required: true,
  },
});

const commentModel = mongoose.model("Comment", commentSchema);
module.exports = commentModel;
