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
const { body,validationResult } = require("express-validator");
router.post(
  "/register",
  [
    body("username")
      .trim()
      .custom((value) => {
        if (!/^[a-zA-Z0-9_-]{5,15}$/.test(value)) {
          throw new Error(
            `UserName accepts 5 to 15 characters.\n UserName should be any lower case or upper case character.\n UserName must contain digit or special symbol “_-”`
          );
        }
        return userModel.findOne({ username: value }).then((user) => {
          if (user) {
            return Promise.reject("Username already exists");
          }
        });
      }),
    body("email")
      .trim()
      .custom((value) => {
        if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(value)) {
          throw new Error("Invalid Email");
        }
        return userModel.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email already exists");
          }
        });
      }),
    body("password")
      .trim()
      .custom((value) => {
        if (
          !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value)
        ) {
          throw new Error(
            "Password must contain Minimum eight characters.\n Password must contain at least one letter, one number and one special character"
          );
        }
        return true;
      }),
    body("userimage").custom((value) => {
      if (value == "") {
        throw new Error("Please Select An Image");
      }
      return true;
    }),
  ],
  async (req, res) => {
    try {
      const { username, email, password, userimage } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() });
      }

      const registeruser = new userModel({
        username,
        email,
        password,
        userimage,
      });

      const a = await registeruser.save();
      res.status(200).json({ message: "user register successfully" });
      console.log(a);
    } catch (err) {
      console.log(err);
    }
  }
);

router.post(
  "/login",
  [
    body("email").custom((value) => {
      if (value == "") {
        throw new Error("Please Fill All The Required Fields");
      }
      return true;
    }),
    body("password").custom((value) => {
      if (value == "") {
        throw new Error("Please Fill All The Required Fields");
      }
      return true;
    }),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() });
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
  }
);

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
      return userModel.findOne({ username: value }).then((user) => {
        if (user) {
          return Promise.reject("Username already exists");
        }
      });
    }),
    body("email").custom((value) => {
      if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(value)) {
        throw new Error("Invalid Email");
      }
      return true
    }),
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
