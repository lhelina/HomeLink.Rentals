import http from "http";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import url from "url";

import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
} from "./controllers/authController.js";

import {
  createListing,
  getAllListings,
  getMyListings,
  getListing,
  updateListing,
  deleteListing,
} from "./controllers/listingController.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

/* ------------------ MongoDB Connection ------------------ */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    console.log("Database:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

/* ------------------ Server ------------------ */
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathParts = parsedUrl.pathname.split("/");

  // CORS headers (manual)
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  /* ---------------- AUTH ROUTES ---------------- */
  if (req.method === "POST" && parsedUrl.pathname === "/api/auth/register")
    return register(req, res);

  if (req.method === "POST" && parsedUrl.pathname === "/api/auth/login")
    return login(req, res);

  if (req.method === "GET" && parsedUrl.pathname === "/api/auth/verify-email")
    return verifyEmail(req, res);

  if (
    req.method === "POST" &&
    parsedUrl.pathname === "/api/auth/forgot-password"
  )
    return forgotPassword(req, res);

  if (
    req.method === "POST" &&
    parsedUrl.pathname === "/api/auth/reset-password"
  )
    return resetPassword(req, res);

  if (req.method === "GET" && parsedUrl.pathname === "/api/auth/me")
    return getMe(req, res);

  /* ---------------- LISTING ROUTES ---------------- */
  // Get all listings
  if (req.method === "GET" && parsedUrl.pathname === "/api/listings")
    return getAllListings(req, res);

  // Get user's listings
  if (
    req.method === "GET" &&
    parsedUrl.pathname === "/api/listings/user/my-listings"
  )
    return getMyListings(req, res);

  // Get single listing by ID
  if (
    req.method === "GET" &&
    pathParts[1] === "api" &&
    pathParts[2] === "listings" &&
    pathParts[3]
  )
    return getListing(req, res, pathParts[3]);

  // Create listing (matches your frontend call)
  if (req.method === "POST" && parsedUrl.pathname === "/api/listings")
    return createListing(req, res);

  // Update listing by ID
  if (
    (req.method === "PUT" || req.method === "PATCH") &&
    pathParts[1] === "api" &&
    pathParts[2] === "listings" &&
    pathParts[3]
  )
    return updateListing(req, res, pathParts[3]);

  // Delete listing by ID
  if (
    req.method === "DELETE" &&
    pathParts[1] === "api" &&
    pathParts[2] === "listings" &&
    pathParts[3]
  )
    return deleteListing(req, res, pathParts[3]);

  /* ---------------- IMAGE / UPLOADS SERVING ---------------- */
  // Example: frontend requests http://localhost:5000/uploads/filename.jpg
  if (req.method === "GET" && parsedUrl.pathname.startsWith("/uploads/")) {
    const filePath = path.join(".", parsedUrl.pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("File not found");
      }

      // Set MIME type based on file extension
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
      };
      res.writeHead(200, {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
      });
      res.end(data);
    });
    return;
  }

  /* ---------------- TEST ROUTE ---------------- */
  if (req.method === "GET" && parsedUrl.pathname === "/api/test") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Backend is running!" }));
  }

  /* ---------------- DB STATUS ---------------- */
  if (req.method === "GET" && parsedUrl.pathname === "/api/db-status") {
    try {
      const userCount = await mongoose.connection.db
        .collection("users")
        .countDocuments();

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          connected: true,
          database: mongoose.connection.name,
          userCount,
        }),
      );
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ connected: false }));
    }
  }

  /* ---------------- NOT FOUND ---------------- */
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
});

/* ------------------ Start Server ------------------ */
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}`);
});
