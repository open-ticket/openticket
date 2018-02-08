const User = require("./User");
const { ValidationError } = require("objection");
const conn = require("../testdb");

const tracker = require("mock-knex").getTracker();

const defaultUser = {
  name: "test user",
  email: "test@example.com",
  password: "hunter2",
};

User.knex(conn);
tracker.install();

afterAll(() => {
  tracker.uninstall();
});

describe("Setting password for a user", () => {
  test("password and passwordConfirm must match", async () => {
    tracker.on("query", query => {
      if (query.method === "insert") {
        return query.response(1);
      }
      return null;
    });
    expect.assertions(1);
    return User.query()
      .insert({
        ...defaultUser,
        passwordConfirm: "hunter2",
      })
      .then(user => {
        expect(user.id).not.toBeUndefined();
      });
  });

  test("error if password and passwordConfirm don't match", async () =>
    User.query()
      .insert({
        ...defaultUser,
        passwordConfirm: "hunter3",
      })
      .catch(e => {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.message.toLowerCase()).toContain("password");
      }));

  test("error if password present but not passwordConfirm", async () =>
    User.query()
      .insert({
        ...defaultUser,
      })
      .catch(e => {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.message.toLowerCase()).toContain("password");
      }));

  test("password not set if password not provided", async () => {
    const user = await User.query().insert({
      name: "test user",
      email: "test@example.com",
    });
    expect(user.password).toBeUndefined();
  });
});
