const User = require("./User");
// const { ValidationError } = require("objection");

describe("Setting password for a user", () => {
  test("password and passwordConfirm must match", () => {
    const user = User.fromJson({
      name: "test user",
      email: "test@example.com",
      password: "hunter2",
      passwordConfirm: "hunter2",
    });
  });
});
