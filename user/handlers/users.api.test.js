const app = require("../server");
const request = require("supertest").agent(app.listen());
const User = require("../models/User");
const conn = require("../testdb");

const tracker = require("mock-knex").getTracker();

const defaultUser = {
  name: "test user",
  email: "test@example.com",
  password: "hunter2",
};

User.knex(conn);
tracker.install();

tracker.on("query", (query, step) => {
  switch (step) {
    case 1: {
      return query.response([defaultUser, defaultUser, defaultUser]);
    }
    case 2: {
      return query.response([]);
    }
    case 3: {
      expect(query.sql).toContain("limit ?");
      expect(query.bindings).toContain(10);
      const array = Array(10).fill(defaultUser);
      return query.response(array);
    }
    case 4: {
      expect(query.sql).toContain("limit ?");
      expect(query.sql).toContain("offset ?");
      expect(query.bindings).toContain(30);
      expect(query.bindings).toContain(10);
      const array = Array(30).fill(defaultUser);
      return query.response(array);
    }
    default: {
      return query.response([]);
    }
  }
});

afterAll(() => {
  tracker.uninstall();
});

describe("/users", () => {
  // step 1
  test("returns list of users", async () => {
    expect.assertions(4);
    const res = await request.get("/users");
    expect(res.status).toBe(200);
    expect(res.body.content).toBeInstanceOf(Array);
    expect(res.body.content).toHaveLength(3);
    expect(res.body.content[0]).toEqual(defaultUser);
  });

  // step 2
  test("returns empty list with ok status if no users", async () => {
    expect.assertions(3);
    const res = await request.get("/users");
    expect(res.status).toBe(200);
    expect(res.body.content).toBeInstanceOf(Array);
    expect(res.body.content).toHaveLength(0);
  });

  // step 3
  test("expect results to paginate by default to 10 results", async () => {
    expect.assertions(5);
    const res = await request.get("/users");
    // check step 3 in the tracker for the SQL checks
    expect(res.status).toBe(200);
    expect(res.body.content).toBeInstanceOf(Array);
    expect(res.body.content).toHaveLength(10);
  });

  // step 4
  test("expect results to allow for custom offset and max length", async () => {
    expect.assertions(7);
    const res = await request.get("/users?offset=10&limit=30");
    // check step 4 in the tracker for the SQL checks
    expect(res.status).toBe(200);
    expect(res.body.content).toBeInstanceOf(Array);
    expect(res.body.content.length).toBeLessThanOrEqual(30);
  });
});
