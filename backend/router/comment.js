const express = require("express");
const router = express.Router();
const Authenticate = require("../middleware/authenticate");
const userModel = require("../model/schema");
const cookieParser = require("cookie-parser");
const commentModel = require("../model/Comment");
router.use(express.json());
router.use(cookieParser());
router.post("/", Authenticate, async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.userID });
    if (user) {
      const comment = new commentModel({
        blogId: req.body.id,
        name: user.username,
        email: user.email,
        comment: req.body.comment,
      });
      const saveComment = await comment.save();
      console.log(saveComment);
      res.status(200).json({ message: "Comment Post Successfully" });
    } else {
      res.status(400).json({ error: "Please Login First" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  console.log("jdvcjdbcjdsc", req.params.id);
  try {
    const comments = await commentModel.find({ blogId: req.params.id });
    res.json(comments);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
