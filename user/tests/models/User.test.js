const User = require("../../models/User");
const { ValidationError } = require("objection");

describe("create new user", () => {
  test("creates a new user", () => {
    const user = User.fromJson({
      name: "Test Name",
      email: "test@example.com",
    });
    expect(user.name).toBe("Test Name");
  });

  test("doesn't require a name", () => {
    const user = User.fromJson({
      email: "test@example.com",
    });
    expect(user.email).toBe("test@example.com");
  });

  test("requires an email", () => {
    expect(() => {
      User.fromJson({
        name: "hello",
      });
    }).toThrow(ValidationError);
  });

  test("name must be a string", () => {
    expect(() => {
      User.fromJson({
        name: 10,
        email: "test@example.com",
      });
    }).toThrow(ValidationError);
  });

  test("email must be a string", () => {
    expect(() => {
      User.fromJson({
        name: "Test User",
        email: 10,
      });
    }).toThrow(ValidationError);
  });
});
