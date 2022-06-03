const express = require("express");
const router = express.Router();
require("../db/conn");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.use(express.json());
const authentication = require("../middleware/authenticate");
const userModel = require("../model/schema");
const blogModel = require("../model/BlogSchema");
const { body, validationResult } = require("express-validator");
router.get("/", async (req, res) => {
  try {
    const allblogs = await blogModel.find({});
    res.json(allblogs);
  } catch (err) {
    console.log(err);
  }
});

// router.get("/account", authentication, (req, res) => {
//   res.send(req.rootUser);
// });

// router.get("/getdata", authentication, (req, res) => {
//   res.send(req.rootUser);
// });

// router.get("/create", authentication, (req, res) => {
//   res.send(req.userID);
// });
// router.patch("/updateProfile", authentication, async (req, res) => {
//   try {
//     const findandUpdateUser = await userModel.findByIdAndUpdate(
//       { _id: req.userID },
//       { ...req.body }
//     );
//     res.json({ message: "user update SuccessFully" });
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.post("/createblog", async (req, res) => {
//   try {
//     const { title, content, catagory, imgurl } = req.body;

//     if (!title || !content || !catagory || !imgurl) {
//       return res
//         .status(422)
//         .json({ error: "please Fill All The Required Fields" });
//     } else {
//       const createBlog = new blogModel({
//         userID: req.body.userid,
//         publishDate: new Date(),
//         publisher: req.body.publisher,
//         title,
//         content,
//         catagory,
//         imgurl,
//       });

//       const a = await createBlog.save();
//       res.status(200).json({ message: "Blog Published" });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

router.get("/myblog", authentication, async (req, res) => {
  try {
    const findUserBlog = await blogModel.find({ userID: req.userID });
    res.json(findUserBlog);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/myblog", async (req, res) => {
  const { id } = req.body;
  try {
    const findcurrentBlog = await blogModel.findByIdAndRemove({ _id: id });
    console.log(findcurrentBlog);
    res.json({ message: "Delete Success" });
  } catch (err) {
    console.log(err);
  }
});

router.get("/education", async (req, res) => {
  try {
    const blogs = await blogModel.find({ catagory: "Education" });
    res.json(blogs);
    console.log(blogs);
  } catch (err) {
    console.log(err);
  }
});

router.get("/fashion", async (req, res) => {
  try {
    const blogs = await blogModel.find({ catagory: "Fashion" });
    res.json(blogs);
  } catch (err) {
    console.log(err);
  }
});

router.get("/fitness", async (req, res) => {
  try {
    const blogs = await blogModel.find({ catagory: "Fitness" });
    res.json(blogs);
  } catch (err) {
    console.log(err);
  }
});

router.get("/food", async (req, res) => {
  try {
    const blogs = await blogModel.find({ catagory: "Food" });
    res.json(blogs);
  } catch (err) {
    console.log(err);
  }
});

router.get("/sports", async (req, res) => {
  try {
    const blogs = await blogModel.find({ catagory: "Sports" });
    res.json(blogs);
  } catch (err) {
    console.log(err);
  }
});
router.get("/technology", async (req, res) => {
  try {
    const blogs = await blogModel.find({ catagory: "Technology" });
    res.json(blogs);
  } catch (err) {
    console.log(err);
  }
});

router.get("/travel", async (req, res) => {
  try {
    const blogs = await blogModel.find({ catagory: "Travel" });
    res.json(blogs);
  } catch (err) {
    console.log(err);
  }
});
router.get("/movie", async (req, res) => {
  try {
    const blogs = await blogModel.find({ catagory: "Movie" });
    res.json(blogs);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const readblog = await blogModel.findOne({ _id: req.params.id });
    res.json(readblog);
    console.log(readblog);
  } catch (err) {
    console.log(err);
  }
});

router.post(
  "/create",
  [
    body("title", "Title length must be of 20").trim().isLength({ min: 20 }),
    body("content", "Content length must be of 1000")
      .trim()
      .isLength({ min: 1000 }),
    body("catagory").custom((value) => {
      if (value === "Please Select Category" || value == "") {
        throw new Error("Please Select A Valid Catagory");
      }
      return true;
    }),
    body("imgurl").custom((value) => {
      if (value == "") {
        throw new Error("Please Select An Image");
      }
      return true;
    }),
  ],
  async (req, res) => {
    try {
      const { title, content, catagory, imgurl, userid } = req.body;
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() });
      }
      const createBlog = new blogModel({
        userID: userid,
        publishDate: new Date(),
        publisher: req.body.publisher,
        title,
        content,
        catagory,
        imgurl,
      });

      const a = await createBlog.save();
      res.status(200).json({ message: "Blog Published" });
      console.log(a);
      // }
    } catch (err) {
      console.log(err);
    }
  }
);

router.patch(
  "/update",
  [
    body("title", "Title length must be of 20").trim().isLength({ min: 20 }),
    body("content", "Content length must be of 1000")
      .trim()
      .isLength({ min: 1000 }),
    body("catagory").custom((value) => {
      if (value === "Please Select Category" || value == "") {
        throw new Error("Please Select A Valid Catagory");
      }
      return true;
    }),
  ],
  async (req, res) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() });
      }
      const findandUpdateBlog = await blogModel.findByIdAndUpdate(
        { _id: req.body.id },
        { ...req.body }
      );
      res.json({ message: "Blog update SuccessFully" });
      console.log(findandUpdateBlog);
    } catch (err) {
      console.log(err);
    }
  }
);

router.delete("/account", async (req, res) => {
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

router.patch("/comment", async (req, res) => {
  try {
    const postComment = await blogModel.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $push: {
          comments: {
            name: req.body.name,
            email: req.body.email,
            comment: req.body.comment,
          },
        },
      }
    );
    return res.status(200).json({ message: "Comment Posted" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
