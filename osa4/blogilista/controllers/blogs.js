const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const userExtractor = require("../utils/middleware").userExtractor;

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post("/", userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body;
  const user = req.user;

  const newBlog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user._id,
  });

  const savedBlog = await newBlog.save();
  user.blogs = [...user.blogs, newBlog._id];
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (req, res) => {
  const user = req.user;

  const blogToDelete = await Blog.findById(req.params.id);

  if (!blogToDelete) {
    throw new Error("Blog not found");
  } else if (blogToDelete.user.toString() !== user._id.toString()) {
    throw new Error("You have no authorization to delete this blog");
  }

  await Blog.findByIdAndDelete(req.params.id);

  user.blogs = user.blogs.filter((id) => id.toString() !== req.params.id);
  await user.save();

  res.status(204).end();
});

blogsRouter.put("/:id", async (req, res) => {
  const { likes } = req.body;

  const modifiedBlog = await Blog.findById(req.params.id);

  if (!modifiedBlog) {
    throw new Error("Blog not found");
  }

  modifiedBlog.likes = likes;

  const updatedBlog = await modifiedBlog.save();
  res.json(updatedBlog);
});

module.exports = blogsRouter;
