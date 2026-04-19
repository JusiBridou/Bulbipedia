import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.PORT = "4001";
process.env.DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://test:test@localhost:5432/test?schema=public";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret-key-min-16";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";

const app = require("../../src/app").default;

test("POST /api/auth/register returns 400 for invalid payload", async () => {
  const res = await request(app).post("/api/auth/register").send({
    email: "invalid-email",
    username: "u",
    password: "123"
  });

  assert.equal(res.status, 400);
  assert.equal(res.body.error, "Validation error");
});

test("POST /api/auth/login returns 400 for invalid payload", async () => {
  const res = await request(app).post("/api/auth/login").send({
    email: "not-an-email",
    password: "123"
  });

  assert.equal(res.status, 400);
  assert.equal(res.body.error, "Validation error");
});

test("GET /api/auth/me returns 401 without token", async () => {
  const res = await request(app).get("/api/auth/me");

  assert.equal(res.status, 401);
  assert.equal(res.body.error, "Unauthorized");
});

test("POST /api/articles returns 401 without token", async () => {
  const res = await request(app).post("/api/articles").send({
    title: "Mon article test",
    summary: "resume",
    content: "Contenu test suffisamment long pour passer la validation de longueur minimale.",
    published: true
  });

  assert.equal(res.status, 401);
  assert.equal(res.body.error, "Unauthorized");
});

test("GET /api/articles/mine returns 401 without token", async () => {
  const res = await request(app).get("/api/articles/mine");

  assert.equal(res.status, 401);
  assert.equal(res.body.error, "Unauthorized");
});

test("POST /api/articles/:slug/rating returns 401 without token", async () => {
  const res = await request(app).post("/api/articles/slug-test/rating").send({ value: 5 });

  assert.equal(res.status, 401);
  assert.equal(res.body.error, "Unauthorized");
});
