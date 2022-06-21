const express = require("express");
const router = express.Router();
const contactModel = require("../model/Contact");

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, message } = req.body;
    const contact = new contactModel({
      username: username,
      email: email,
      message: message,
    });
    await contact.save();
    res.status(200).json({ message: "Message Sent Successfully" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
