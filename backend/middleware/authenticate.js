const jwt = require("jsonwebtoken");
const userModel = require("../model/schema");
const { SECRET_KEY } = require("../config");
const Authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.owner;
    const verifytoken = jwt.verify(token, SECRET_KEY);

    const rootUser = await userModel.findOne({
      _id: verifytoken._id,
      "tokens:token": token,
    });

    if (!rootUser) {
      throw new Error("User Not Found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next();
  } catch (err) {
    res.status(400).send("Unauthorized :  No Token Provided");
    console.log(err);
  }
};

module.exports = Authenticate;
