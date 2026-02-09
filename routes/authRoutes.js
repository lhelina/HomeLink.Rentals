import http from "http";
import url from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
} from "./controllers/authController.js";

import { auth } from "./middleware/auth.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

/* ---------- MongoDB ---------- */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

/* ---------- SERVER ---------- */
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  /* ---------- CORS ---------- */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  /* ---------- AUTH ROUTES ---------- */

  // POST /api/auth/register
  if (req.method === "POST" && pathname === "/api/auth/register") {
    return register(req, res);
  }

  // POST /api/auth/login
  if (req.method === "POST" && pathname === "/api/auth/login") {
    return login(req, res);
  }

  // GET /api/auth/verify-email
  if (req.method === "GET" && pathname === "/api/auth/verify-email") {
    return verifyEmail(req, res);
  }

  // POST /api/auth/forgot-password
  if (req.method === "POST" && pathname === "/api/auth/forgot-password") {
    return forgotPassword(req, res);
  }

  // POST /api/auth/reset-password
  if (req.method === "POST" && pathname === "/api/auth/reset-password") {
    return resetPassword(req, res);
  }

  // GET /api/auth/me (PROTECTED)
  if (req.method === "GET" && pathname === "/api/auth/me") {
    return auth(req, res, () => getMe(req, res));
  }

  /* ---------- NOT FOUND ---------- */
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
});

/* ---------- START ---------- */
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
