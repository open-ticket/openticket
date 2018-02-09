const app = require("../server");
const request = require("supertest").agent(app.listen());
const { jsonPostRequest } = require("../../supertestHelpers")(request);

const tracker = require("mock-knex").getTracker();

const defaultParams = {
  name: "Test User",
  email: "test@example.com",
};

tracker.install();

tracker.on("query", (query, step) => {
  switch (step) {
    case 1: {
      return query.response([]);
    }
    case 2: {
      return query.response([]);
    }
    case 3: {
      return query.reject(
        `${
          query.sql
        } - duplicate key violates unique constraint "users_email_unique"`,
      );
    }
    default: {
      return query.response([]);
    }
  }
});

afterAll(() => {
  tracker.uninstall();
});

describe("POST /users", () => {
  // step 1
  test("only email required to create user", async () => {
    expect.assertions(4);
    const res = await jsonPostRequest("/users", { email: defaultParams.email });
    expect(res.status).toBe(201);
    expect(res.body.content.email).toBe(defaultParams.email);
    expect(res.body.content.password).toBeUndefined();
    expect(res.body.content.id).not.toBeUndefined();
  });

  // step 2
  test("succeeds with email + name", async () => {
    expect.assertions(5);
    const res = await jsonPostRequest("/users", defaultParams);
    expect(res.status).toBe(201);
    expect(res.body.content.name).toBe(defaultParams.name);
    expect(res.body.content.email).toBe(defaultParams.email);
    expect(res.body.content.password).toBeUndefined();
    expect(res.body.content.id).not.toBeUndefined();
  });

  test("fails if incorrectly formatted email provided", async () => {
    expect.assertions(2);
    const res = await jsonPostRequest("/users", { email: "hello" });
    expect(res.status).toBe(400);
    expect(res.body.error.toLowerCase()).toContain("email");
  });

  // step 3
  test("shows helpful error message if duplicate email", async () => {
    expect.assertions(3);
    const res = await jsonPostRequest("/users", defaultParams);
    expect(res.status).toBe(400);
    expect(res.body.error.toLowerCase()).toContain("email");
    expect(res.body.error.toLowerCase()).toContain("used");
  });

  test("accept password if included, but digest not returned", async () => {
    expect.assertions(2);
    const res = await jsonPostRequest("/users", {
      ...defaultParams,
      password: "hunter2",
    });
    expect(res.status).toBe(201);
    expect(res.body.content.password).toBeUndefined();
  });

  test("reject password if less than 6 characters (with appropriate error)", async () => {
    expect.assertions(2);
    const res = await jsonPostRequest("/users", {
      ...defaultParams,
      password: "hello",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("too short");
  });
});
