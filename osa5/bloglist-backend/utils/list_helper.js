const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr) => acc + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const mostLiked = Math.max(...blogs.map((item) => item.likes));

  return blogs.find((item) => item.likes === mostLiked);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorCounter = _.countBy(blogs, "author");
  const listOfAuthor = _.map(authorCounter, (blogs, author) => ({
    author,
    blogs: blogs,
  }));

  return _.maxBy(listOfAuthor, "blogs");
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorGroup = _.groupBy(blogs, "author");
  const authorAndLikes = _.map(authorGroup, (object, author) => ({
    author,
    likes: _.sumBy(object, "likes"),
  }));

  return _.maxBy(authorAndLikes, "likes");
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
