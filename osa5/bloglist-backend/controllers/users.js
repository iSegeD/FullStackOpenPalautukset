const bcrypt = require("bcrypt");
const usersRoute = require("express").Router();
const User = require("../models/users");

usersRoute.get("/", async (req, res) => {
  const allUsers = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
  });
  res.json(allUsers);
});

usersRoute.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  if (!password) {
    const error = new Error("Password is required");
    error.status = 400;
    throw error;
  } else if (password.length < 3) {
    const error = new Error("Password must be at least 3 characters long");
    error.status = 400;
    throw error;
  }

  const hashSalt = 10;
  const hashPassword = await bcrypt.hash(password, hashSalt);

  const user = new User({
    username,
    name,
    hashPassword,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

module.exports = usersRoute;
