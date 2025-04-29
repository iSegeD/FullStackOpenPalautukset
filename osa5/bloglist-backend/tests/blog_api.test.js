const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const mongoHelper = require("./mongoHelper");
const Blog = require("../models/blog");

describe("Actions before running `blog_api.test` in MongoDB", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(mongoHelper.testData);
  });

  describe("Checking the data received from the blog", () => {
    test("All blogs are returned as JSON", async () => {
      const res = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(res.body.length, mongoHelper.testData.length);
    });

    test("All blogs have the correct ID key", async () => {
      const res = await api.get("/api/blogs");
      const correctID = res.body.some((item) => Object.hasOwn(item, "_id"));

      assert.strictEqual(correctID, false);
    });
  });

  describe("Verification of adding a new blog", () => {
    let token;
    let user;
    beforeEach(async () => {
      const data = await mongoHelper.testUserAndToken();
      token = data.token;
      user = data.user;
    });

    test("A new blog can be added", async () => {
      const newBlog = {
        title: "FullStackOpen",
        author: "Sergey Dolzhenko",
        url: "www.test.com",
        likes: 12,
        user: user._id,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const res = await api.get("/api/blogs");
      assert.strictEqual(res.body.length, mongoHelper.testData.length + 1);

    });

    test("If a blog has no likes, the default value is 0", async () => {
      const blogWithoutLikes = {
        title: "Karelia AMK",
        author: "Sege D",
        url: "www.fullstacktest.com",
        user: user._id,
      };

      const res = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(blogWithoutLikes)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(res.body.likes, 0);
    });

    test("A blog without the required info can't be added", async () => {
      const wrongBlog = {
        author: "Sergey Anonymous",
        likes: 20,
        user: user._id,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(wrongBlog)
        .expect(400);
      const res = await api.get("/api/blogs");
      assert.strictEqual(res.body.length, mongoHelper.testData.length);
    });

    test("A blog without a token can't be added", async () => {
      const blog = {
        title: "Token missing",
        author: "Sege D",
        url: "www.fullstacktest.com",
        user: user._id,
      };

      await api.post("/api/blogs").send(blog).expect(401);
      const res = await api.get("/api/blogs");
      assert.strictEqual(res.body.length, mongoHelper.testData.length);
    });
  });

  describe("Verification of blog deletion", () => {
    let token;
    let user;

    beforeEach(async () => {
      const data = await mongoHelper.testUserAndToken();
      token = data.token;
      user = data.user;
    });

    test("The blog can be deleted", async () => {
      const blog = {
        title: "BlogForDelition",
        author: "Sergey Dolzhenko",
        url: "www.test.com",
        likes: 33,
        user: user._id,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(blog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const allBlogs = await mongoHelper.blogsInDB();
      assert.strictEqual(allBlogs.length, mongoHelper.testData.length + 1);

      const blogforDeletion = allBlogs[allBlogs.length - 1];

      await api
        .delete(`/api/blogs/${blogforDeletion.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const afterChanges = await mongoHelper.blogsInDB();
      assert.strictEqual(afterChanges.length, mongoHelper.testData.length);
    });

    test("Deleting a blog with non existing ID", async () => {
      const fakeID = "507f1f77bcf99cd779489333";

      await api
        .delete(`/api/blogs/${fakeID}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
  });

  describe("Verification of blog changes", () => {
    test("The selected blog can be changed", async () => {
      const allBlogs = await mongoHelper.blogsInDB();
      const blogForChange = allBlogs[1];

      const updatedBlog = { ...blogForChange, likes: 10 };

      const res = await api
        .put(`/api/blogs/${blogForChange.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(res.body.likes, 10);

      const afterChanges = await mongoHelper.blogsInDB();
      const modifiedBlog = afterChanges.find(
        (item) => item.id === blogForChange.id
      );

      assert.strictEqual(modifiedBlog.likes, 10);
    });
  });

  test("Changing a blog with non existing ID", async () => {
    const fakeID = "507f1f77bcf99cd779489333";
    const updatedBlog = { likes: 10 };

    await api.put(`/api/blogs/${fakeID}`).send(updatedBlog).expect(404);
  });
});

after(async () => {
  await mongoose.connection.close();
});
