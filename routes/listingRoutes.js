import {
  createListing,
  getAllListings,
  getMyListings,
  getListing,
  updateListing,
  deleteListing,
  updateListingStatus,
} from "../controllers/listingController.js";

import { auth } from "../middleware/auth.js";

// MAIN ROUTE HANDLER
export const handleListingRoutes = async (req, res) => {
  const url = req.url;
  const method = req.method;

  // GET /api/listings
  if (method === "GET" && url === "/api/listings") {
    return getAllListings(req, res);
  }

  // GET /api/listings/:id
  const idMatch = url.match(/^\/api\/listings\/([a-zA-Z0-9]+)/);
  if (method === "GET" && idMatch) {
    const id = idMatch[1];
    return getListing(req, res, id);
  }

  // GET /api/listings/user/my-listings
  if (method === "GET" && url === "/api/listings/user/my-listings") {
    await auth(req, res);
    return getMyListings(req, res);
  }

  // POST /api/listings/create
  if (method === "POST" && url === "/api/listings/create") {
    await auth(req, res);
    return createListing(req, res);
  }

  // PUT /api/listings/:id
  if (method === "PUT" && idMatch) {
    const id = idMatch[1];
    await auth(req, res);
    return updateListing(req, res, id);
  }

  // PATCH /api/listings/:id/status
  if (method === "PATCH" && url.includes("/status")) {
    const id = url.split("/")[3];
    await auth(req, res);
    return updateListingStatus(req, res, id);
  }

  // DELETE /api/listings/:id
  if (method === "DELETE" && idMatch) {
    const id = idMatch[1];
    await auth(req, res);
    return deleteListing(req, res, id);
  }

  // Fallback
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
};
