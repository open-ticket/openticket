const app = require("../server");
const request = require("supertest").agent(app.listen());

const tracker = require("mock-knex").getTracker();

const defaultParams = {
  name: "Test User",
  email: "test@example.com",
};

tracker.install();

const jsonPostRequest = (path, data) =>
  request
    .post(path)
    .send(data)
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");

tracker.on("query", (query, step) => {
  switch (step) {
    case 1: {
      return query.response([]);
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
});
