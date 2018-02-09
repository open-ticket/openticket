const app = require("../server");
const request = require("supertest").agent(app.listen());
const { jsonGetRequest } = require("../../supertestHelpers")(request);

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
    case 1: {
      expect(query.bindings).toContain(defaultUser.id);
      return query.response(defaultUserObj);
    }
    case 2: {
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

describe("GET /users/:id", () => {
  // step 1
  test("get user returns with that id", async () => {
    expect.assertions(4);
    const res = await jsonGetRequest(`/users/${defaultUser.id}`);
    expect(res.status).toBe(200);
    expect(res.body.content).toEqual(defaultUser);
    expect(res.body.content.password).toBeUndefined();
  });

  // step 2
  test("get non-existent user returns 404 not found", async () => {
    expect.assertions(3);
    const res = await jsonGetRequest("/users/hello");
    expect(res.status).toBe(404);
    expect(res.body.error.toLowerCase()).toContain("not found");
  });
});
