const app = require("../server");
const request = require("supertest").agent(app.listen());
const { jsonPutRequest } = require("../../supertestHelpers")(request);

const tracker = require("mock-knex").getTracker();

tracker.install();

const defaultUser = {
  id: "e33b6411-f1d2-4676-8692-06288c4ba3b0",
  name: "Test User",
  email: "test@example.com",
};

const defaultUserObj = {
  ...defaultUser,
  password: "$2a$10$NndPUw7myx827OUm9EKjvuR6BHQ5MqVBVtamclTv88G/z696EEJvO",
};

tracker.on("query", (query, step) => {
  switch (step) {
    case 1:
    case 2: {
      expect(query.bindings).toContain(defaultUser.id);
      return query.response(defaultUserObj);
    }
    case 3: {
      expect(query.bindings).toContain("hello");
      return query.response();
    }
    default: {
      return query.response([]);
    }
  }
});

afterAll(() => {
  tracker.uninstall();
});

describe("PUT /users/:id/validatePassword", () => {
  // step 1
  test("validate password for valid user with valid password returns true", async () => {
    expect.assertions(3);
    const res = await jsonPutRequest(
      `/users/${defaultUser.id}/validatePassword`,
      { password: "hunter2" },
    );
    expect(res.status).toBe(200);
    expect(res.body.content).toEqual({ valid: true });
  });

  // step 2
  test("validate password for valid user with invalid password returns false", async () => {
    expect.assertions(3);
    const res = await jsonPutRequest(
      `/users/${defaultUser.id}/validatePassword`,
      { password: "hunter" },
    );
    expect(res.status).toBe(200);
    expect(res.body.content).toEqual({ valid: false });
  });

  // step 3
  test("validate password for non-existent user returns 404", async () => {
    expect.assertions(3);
    const res = await jsonPutRequest("/users/hello/validatePassword", {
      password: "hunter2",
    });
    expect(res.status).toBe(404);
    expect(res.body.error).toContain("not found");
  });

  test("request without password key in body returns bad request", async () => {
    expect.assertions(2);
    const res = await jsonPutRequest(
      `/users/${defaultUser.id}/validatePassword`,
      {},
    );
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("password");
  });
});
