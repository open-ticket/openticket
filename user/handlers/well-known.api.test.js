const request = require("supertest");
const { server } = require("../server");

afterEach(() => {
  server.close();
});

describe("heartbeat", () => {
  test("returns successful response", async () => {
    expect.assertions(3);
    const res = await request(server).get("/.well-known/heartbeat");
    expect(res.status).toBe(200);
    expect(res.body.content).toEqual({ ok: true });
    expect(res.headers["content-type"]).toContain("application/json");
  });
});
