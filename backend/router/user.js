const express = require("express");
// const app = express();
const router = express.Router();
require("../db/conn");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { SECRET_KEY, mail, pass, service } = require("../config");
router.use(cookieParser());
router.use(express.json());
const verifyEmail = require("../middleware/emailAuth");
const authentication = require("../middleware/authenticate");
const userModel = require("../model/schema");
const blogModel = require("../model/BlogSchema");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const transporter = nodemailer.createTransport({
  service: service,
  port: 587,
  secure: true,
  auth: {
    user: mail,
    pass: pass,
  },
});
// app.set("views", __dirname + "/views");
// app.set("view engine", "hbs");
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
      // console.log(crypto.randomBytes(10).toString('hex'));
      const { username, email, password, userimage } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() });
      }
      // crypto.randomBytes(64).toString("hex")
      else {
        const registeruser = new userModel({
          username,
          email,
          password,
          userimage,
          emailToken: crypto.randomBytes(64).toString("hex"),
          isVerified: false,
        });

        const a = await registeruser.save();
        let mailOptions = {
          from: mail,
          to: registeruser.email,
          subject: `Blog.com - Verify Your Email`,
          html: `<h2>Thank You ${registeruser.username} for registering on our site</h2>
        <h4>Please Verify Your Email To Continue...</h4>
        <a href="http://${req.headers.host}/user/verify_email?token=${registeruser.emailToken}">Verify Your Email</a>
        `,
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            res
              .status(200)
              .json({ message: "Verification Email Sent Successfully" });
          }
        });
        console.log(a);
      }
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
  verifyEmail,
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
          expires: new Date(Date.now() + 100000000),
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
      return true;
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

router.get("/verify_email", async (req, res) => {
  try {
    const token = req.query.token;
    const user = await userModel.findOne({ emailToken: token });
    if (user) {
      user.emailToken = null;
      user.isVerified = true;
      await user.save();
      res.status(200).send(
        `<h1 style='text-align : center; color : green'>Email Verified Successfully</h1>
          <h3 style='text-align : center';>Go To Login Page To Login</h3>
          `
      );
    } else {
      res.status(400).send(
        `<h1 style='text-align : center; color : red'>Email Is Not Verified</h1>
          <h3 style='text-align : center'>Please Check Your Email or Go To Login</h3>
          `
      );
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/forget-password", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const payload = {
        id: user.id,
        email: user.email,
      };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "20m" });
      const mailOptions = {
        from: mail,
        to: req.body.email,
        subject: "Blog.com - Generate New Password",
        html: `<h4>Click To Generate New Password</h4>
        <a href="http://${req.headers.host}/user/reset-password/${user._id}/${token}">Here</a>
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          res.status(400).send({ error: "SomeThing Went Wrong" });
          console.log(err);
        } else {
          res
            .status(200)
            .send({ message: "Please Check Your Email for further Process" });
        }
      });
    } else {
      res.status(400).send({ error: "Email Does Not Exist" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/reset-password/:id/:token", async (req, res) => {
  try {
    const { id, token } = req.params;
    console.log(id, token);
    const user = await userModel.findOne({ _id: id });
    if (user) {
      const decode = jwt.verify(token, SECRET_KEY);
      res.render("generate", { id: id, token: token, host: req.headers.host });
      // res.send(`
      // <form method="POST" action="/user/reset-password/${id}/${token}>
      //   <input type="password" name="password" value=""/>
      //   <input type="password" name="cpassword" value="" />
      //   <button type="submit">Reset</button>
      // </form>
      // `);
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  console.log("Api Hit", req.params.id);
  console.log("This is body", req.body);
  try {
    const { id } = req.params;
    console.log(req.body);
    // const user = await userModel.findOne({ _id: id });
    // if (user) {
    //   console.log("this is user", user);
    //   const { password, confirmPass } = req.body;
    //   if (confirmPass === password) {
    //     console.log(req.body.password, req.body.confirmPass);
    //     const newUser = await userModel.findByIdAndUpdate(
    //       { _id: id },
    //       { $set: { password: password } }
    //     );
    //     console.log(password);
    //     await newUser.save();
    //     console.log(newUser);
    //     res.status(200).send("Password Reset Successfully");
    //   } else {
    //     res.status(400).send("Password and confirm Password didn't match");
    //   }
    // } else {
    //   res.status(400).send("User Not Found");
    // }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
