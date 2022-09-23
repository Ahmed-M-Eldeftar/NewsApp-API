const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
require("./db/mongoose");
app.use(express.json());
const userRouter = require("./routers/user");
app.use(userRouter);
const newRouter = require("./routers/news");
app.use(newRouter);
app.listen(port, () => {
  console.log("server is running");
});
