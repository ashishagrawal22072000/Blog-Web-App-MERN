const userModel = require("../model/schema");
const verifyEmail = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user.isVerified === true) {
      next();
    } else {
      console.log("First Verify Your Email");
      res.status(400).json({ error: "Please Verify Your Email First" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = verifyEmail;
