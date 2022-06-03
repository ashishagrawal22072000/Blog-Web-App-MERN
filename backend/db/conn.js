const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://ashish:ashishdatabase1@cluster0.15kim.mongodb.net/practcemongodb?retryWrites=true&w=majority"
  )
  .then((res) => {
    console.log("connection Successfull");
  })
  .catch((err) => {
    console.log(err);
  });
