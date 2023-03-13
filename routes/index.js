const express = require("express");
const app = express();
const router = express.Router();

const todoRouter = require("./todo");

router.use("/todo", todoRouter);

router.use("*", (req, res, next) => {
  res.redirect("/todo");
});
module.exports = router;
