const User = require("../models/users");
const mongoHelper = require("./mongoHelper");
const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const superTest = require("supertest");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const app = require("../app");
const api = superTest(app);

describe("Actions before running `user_api.test` in MongoDB", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const hashPassword = await bcrypt.hash("password", 10);
    const user = new User({ username: "Admin", hashPassword });

    await user.save();
  });

  describe("Creating a user to the MongoDB", () => {
    test("Successful creation of a new user", async () => {
      const usersAtTheBeginning = await mongoHelper.usersInDB();

      const newUser = {
        username: "Sege",
        name: "Sergey Dolzhenko",
        password: "mypassword",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtThEnd = await mongoHelper.usersInDB();
      assert.strictEqual(usersAtThEnd.length, usersAtTheBeginning.length + 1);

      const userName = usersAtThEnd.map((item) => item.name);
      assert(userName.includes(newUser.name));
    });
  });

  test("Creation of a user with an invalid `username`", async () => {
    const usersAtTheBeginning = await mongoHelper.usersInDB();

    const newUser = {
      username: "Ad",
      name: "Anonymous",
      password: "password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtTheEnd = await mongoHelper.usersInDB();
    assert(
      result.body.error.includes(
        "`Username` is required and must be at least 3 characters long"
      )
    );

    assert.strictEqual(usersAtTheEnd.length, usersAtTheBeginning.length);
  });

  test("Creation of a user with an invalid `password`", async () => {
    const usersAtTheBeginning = await mongoHelper.usersInDB();

    const newUser = {
      username: "FullStack",
      name: "Anonymous",
      password: "pa",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtTheEnd = await mongoHelper.usersInDB();
    assert(
      result.body.error.includes("Password must be at least 3 characters long")
    );

    assert.strictEqual(usersAtTheEnd.length, usersAtTheBeginning.length);
  });

  test("Creation of a user without a `password`", async () => {
    const usersAtTheBeginning = await mongoHelper.usersInDB();

    const newUser = {
      usename: "FullStack",
      name: "Anonymous",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtTheEnd = await mongoHelper.usersInDB();
    assert(result.body.error.includes("Password is required"));

    assert.strictEqual(usersAtTheEnd.length, usersAtTheBeginning.length);
  });

  test("Creation of a user with a name that is already taken", async () => {
    const usersAtTheBeginning = await mongoHelper.usersInDB();

    const newUser = {
      username: "Admin",
      name: "Anonymous",
      password: "password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtTheEnd = await mongoHelper.usersInDB();
    assert(result.body.error.includes("Expected `username` to be unique"));

    assert.strictEqual(usersAtTheEnd.length, usersAtTheBeginning.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
