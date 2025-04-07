const express = require("express");
const userRouter = express.Router();

const {
  registerUser,
  getUsers,
  getSingleUser,
} = require("../controller/userController");

userRouter.post("/", registerUser);
userRouter.get("/", getUsers);

userRouter.get("/:id", getSingleUser);

module.exports = userRouter;
