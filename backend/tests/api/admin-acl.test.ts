import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.PORT = "4001";
process.env.DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://test:test@localhost:5432/test?schema=public";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret-key-min-16";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";

const app = require("../../src/app").default;

type Role = "USER" | "ADMIN";

function makeToken(role: Role) {
  return jwt.sign(
    {
      sub: role === "ADMIN" ? "admin-id" : "user-id",
      role,
      email: role === "ADMIN" ? "admin@example.com" : "user@example.com",
      username: role === "ADMIN" ? "admin" : "user"
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h"
    }
  );
}

test("GET /api/admin/users returns 401 when missing token", async () => {
  const res = await request(app).get("/api/admin/users");

  assert.equal(res.status, 401);
  assert.equal(res.body.error, "Unauthorized");
});

test("GET /api/admin/users returns 403 for non-admin user token", async () => {
  const token = makeToken("USER");

  const res = await request(app).get("/api/admin/users").set("Authorization", `Bearer ${token}`);

  assert.equal(res.status, 403);
  assert.equal(res.body.error, "Forbidden");
});

test("DELETE /api/admin/users/:id returns 403 for non-admin user token", async () => {
  const token = makeToken("USER");

  const res = await request(app)
    .delete("/api/admin/users/some-user-id")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(res.status, 403);
  assert.equal(res.body.error, "Forbidden");
});

test("GET /api/admin/articles returns 403 for non-admin user token", async () => {
  const token = makeToken("USER");

  const res = await request(app).get("/api/admin/articles").set("Authorization", `Bearer ${token}`);

  assert.equal(res.status, 403);
  assert.equal(res.body.error, "Forbidden");
});
