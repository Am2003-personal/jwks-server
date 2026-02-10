//Anthony Munoz CSCE3550
//2-9-2026
const request = require("supertest");
const app = require("../server");

describe("JWKS Server Tests", () => {
  test("GET JWKS should return keys", async () => {
    const res = await request(app).get("/.well-known/jwks.json");
    expect(res.statusCode).toBe(200);
    expect(res.body.keys).toBeDefined();
  });

  test("POST /auth returns token", async () => {
    const res = await request(app).post("/auth");
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("POST /auth?expired=true returns token", async () => {
    const res = await request(app).post("/auth?expired=true");
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
