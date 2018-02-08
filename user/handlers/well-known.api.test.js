const app = require("../server");
const request = require("supertest").agent(app.listen());

describe("heartbeat", () => {
  test("returns successful response", async () => {
    expect.assertions(3);
    const res = await request.get("/.well-known/heartbeat");
    expect(res.status).toBe(200);
    expect(res.body.content).toEqual({ ok: true });
    expect(res.headers["content-type"]).toContain("application/json");
  });
});
