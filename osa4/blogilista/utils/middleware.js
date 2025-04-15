const logger = require("./logger");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown endpoint" });
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  } else {
    req.token = null;
  }

  next();
};

const userExtractor = async (req, res, next) => {
  const token = req.token;

  if (!token) {
    throw new Error("Token missing");
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);

  const user = await User.findById(decodedToken.id);

  if (!user) {
    throw new Error("User not found");
  }

  req.user = user;
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({
      error: "`Username` is required and must be at least 3 characters long",
    });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "Expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "Token invalid" });
  } else if (error.message === "Token missing") {
    return response.status(401).json({ error: "Token missing" });
  } else if (error.message === "Blog not found") {
    return response.status(404).json({ error: error.message });
  } else if (error.message === "User not found") {
    return response.status(401).json({ error: error.message });
  } else if (
    error.message === "You have no authorization to delete this blog"
  ) {
    return response.status(403).json({ error: error.message });
  } else if (error.message === "Invalid username or password") {
    return response.status(401).json({ error: error.message });
  } else if (error.status === 400) {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
