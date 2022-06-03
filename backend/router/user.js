const express = require("express");
const router = express.Router();
require("../db/conn");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { SECRET_KEY } = require("../config");
router.use(cookieParser());
router.use(express.json());
const authentication = require("../middleware/authenticate");
const userModel = require("../model/schema");
const blogModel = require("../model/BlogSchema");
const { body, check, validationResult } = require("express-validator");
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, userimage } = req.body;

    if (!username || !email || !password) {
      return res
        .status(422)
        .json({ error: "please Fill All The Required Fields" });
    }
    const userexist = await userModel.findOne({ email: email });

    if (userexist) {
      return res.status(422).json({ error: "Email Already Exist" });
    } else {
      const registeruser = new userModel({
        username,
        email,
        password,
        userimage,
      });

      const a = await registeruser.save();
      res.status(200).json({ message: "user register successfully" });
      console.log(a);
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(422)
        .json({ error: "please Fill All The Required Fields" });
    }
    const userlogin = await userModel.findOne({ email: email });

    if (userlogin) {
      const ismatch = await bcrypt.compare(password, userlogin.password);

      const token = jwt.sign({ _id: userlogin._id }, SECRET_KEY);
      console.log(token);

      res.cookie("owner", token, {
        expires: new Date(Date.now() + 10000000000),
        httpOnly: true,
      });

      if (!ismatch) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        res.json({ message: "Login Successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/", authentication, (req, res) => {
  res.send(req.rootUser);
});

router.get("/logout", (req, res) => {
  res.clearCookie("owner", { path: "/" });
  res.status(200).send({ message: "Logout" });
});

router.delete("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    const findcurrentBlog = await blogModel.deleteMany({ userID: id });
    const findcurrentuser = await userModel.findByIdAndDelete({ _id: id });
    res.clearCookie("jwtt");
    console.log(findcurrentBlog);
    console.log(findcurrentuser);
    res.json({ message: "Delete Success" });
  } catch (err) {
    console.log(err);
  }
});

router.patch(
  "/update",
  [
    body("username").custom((value) => {
      if (!/^[a-zA-Z0-9_-]{5,15}$/.test(value)) {
        throw new Error(
          `UserName accepts 5 to 15 characters.\n UserName should be any lower case or upper case character.\n UserName must contain digit or special symbol “_-”`
        );
      }
      return true;
    }),
    body("email", "Please provide A Valid Email").isEmail(),
  ],
  authentication,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }
      const findandUpdateUser = await userModel.findByIdAndUpdate(
        { _id: req.userID },
        { ...req.body }
      );
      res.json({ message: "user update SuccessFully" });
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
