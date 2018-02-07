const User = require("./User");
// const { ValidationError } = require("objection");
const conn = require("../testdb");

const tracker = require("mock-knex").getTracker();

User.knex(conn);
tracker.install();
// User.knex(knex).inser = conn;

describe("Setting password for a user", () => {
  test("password and passwordConfirm must match", async () => {
    tracker.on("query", query => {
      if (query.method === "insert") {
        return query.response(1);
      }
      return null;
    });
    const user = await User.query().insert({
      name: "test user",
      email: "test@example.com",
      password: "hunter2",
      passwordConfirm: "hunter2",
    });
    console.log(user.password);
  });
});
