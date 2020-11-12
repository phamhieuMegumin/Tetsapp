const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Todo = require("../models/Todos");

const signToken = (userID) => {
  return JWT.sign(
    {
      iss: "PhamHieu",
      sub: userID,
    },
    "PhamHieu",
    { expiresIn: "1h" }
  );
};

userRouter.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      res.status(400).json({
        message: { msgBody: "User name has been taken", msgError: true },
      });
    } else {
      const newUser = new User({ username, password, role });
      await newUser.save((err) => {
        if (err) {
          res.status(500).json({
            message: { msgBody: "Error has occured", msgError: true },
          });
        } else {
          res.status(201).json({
            message: {
              msgBody: "Account successfully create",
              msgError: false,
            },
          });
        }
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: { msgBody: "Error has occured", msgError: true } });
  }
});
userRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, username, role } = req.user;
      const token = signToken(_id);
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });
      res.status(200).json({ isAuthenticated: true, user: { username, role } });
    }
  }
);

userRouter.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("access_token");
    res.json({ user: { username: "", role: "" }, success: true });
  }
);

userRouter.post(
  "/todo",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const todo = new Todo(req.body); //create new model
      await todo.save();
      req.user.todos.push(todo); //push todoID
      try {
        await req.user.save(); // not create new model just update
        res.status(200).json({
          message: { msgBody: "Success create todo", msgError: false },
        });
      } catch (error) {
        res
          .status(500)
          .json({ message: { msgBody: "Error has occured", msgError: true } });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: { msgBody: "Error has occured", msgError: true } });
    }
  }
);

userRouter.get(
  "/todos",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById({ _id: req.user._id })
      .populate("todos")
      .exec((err, document) => {
        if (err) {
          res.status(500).json({
            message: { msgBody: "Error has occured", msgError: true },
          });
        } else
          res.status(200).json({ todos: document.todos, authenticated: true });
      });
  }
);
userRouter.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role === "admin") {
      res
        .status(200)
        .json({ message: { msgBody: "you are an admin", msgError: false } });
    } else {
      res
        .status(403)
        .json({ message: { msgBody: "you are not an admin", msgError: true } });
    }
  }
);

userRouter.get(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { username, role } = req.user;
    res.status(200).json({
      isAuthenticated: true,
      user: { username: username, role: role },
    });
  }
);
module.exports = userRouter;
