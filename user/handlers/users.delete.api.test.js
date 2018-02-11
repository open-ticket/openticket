const app = require("../server");
const request = require("supertest").agent(app.listen());
const { jsonDeleteRequest } = require("../../supertestHelpers")(request);

const tracker = require("mock-knex").getTracker();

tracker.install();

afterAll(() => {
  tracker.uninstall();
});

const testUser = {
  id: "testUserId",
  isDeleted: false,
  name: "Test User",
  email: "test@example.com",
};

tracker.on("query", (query, step) => {
  switch (step) {
    case 1:
    case 2: {
      expect(query.method).toBe("update");
      return query.response(1);
    }
    case 3: {
      // mock successful hard delete
      expect(query.method).toBe("del");
      expect(query.bindings).toContain(testUser.id);
      return query.response(1);
    }
    case 4: {
      // mock unsuccessful delete
      return query.response(0);
    }
    default: {
      return query.response(0);
    }
  }
});

describe("DELETE /users/:id/", () => {
  // step 1
  test("sending request at real user soft-deletes user (isDeleted => true)", async () => {
    expect.assertions(3);
    const res = await jsonDeleteRequest(`/users/${testUser.id}/`);
    expect(res.status).toBe(200);
    expect(res.body.content.isDeleted).toBeTruthy();
  });

  test("sending request at real user with force set to false will soft-delete user (isDeleted => true)", async () => {
    expect.assertions(3);
    const res = await jsonDeleteRequest(`/users/${testUser.id}/?force=false`);
    expect(res.status).toBe(200);
    expect(res.body.content.isDeleted).toBeTruthy();
  });
  // step 3
  test("deleting real user (with force set to true) returns 204 no content", async () => {
    expect.assertions(3);
    const res = await jsonDeleteRequest(`/users/${testUser.id}/?force=true`);
    expect(res.status).toBe(204);
  });

  // step 4
  test("deleting non-existent user returns 404", async () => {
    expect.assertions(1);
    const res = await jsonDeleteRequest(`/users/${testUser.id}/`);
    expect(res.status).toBe(404);
  });
});
