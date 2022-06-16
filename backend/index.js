const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

require("./db/conn");

const user = require("./router/user");
const blog = require("./router/blog");
const comment = require("./router/comment");
const { PORT } = require("./config");

app.use("/user", user);
app.use("/blog", blog);
app.use("/comment", comment); //

app.listen(PORT, () => {
  console.log("listening on port" + PORT);
});
