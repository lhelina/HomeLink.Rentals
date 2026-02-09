import Listing from "../models/Listing.js";
import { auth } from "../middleware/auth.js";
import formidable from "formidable";
/* Helper: read JSON body */
const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject("Invalid JSON");
      }
    });
  });
};

/* CREATE */
export const createListing = (req, res) => {
  const form = formidable({
    multiples: true,
    uploadDir: "./uploads",
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Server error" }));
    }

    try {
      const images = files.images
        ? Array.isArray(files.images)
          ? files.images.map((f) => f.newFilename)
          : [files.images.newFilename]
        : [];

      // Save your listing to MongoDB here, e.g.:
      const listing = await Listing.create({
        ...fields,
        images: images.map((filename) => `/uploads/${filename}`),
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Listing created", listing }));
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Server error" }));
    }
  });
};
/* READ ALL */
export const getAllListings = async (req, res) => {
  try {
    console.log("Fetching all listings...");
    const listings = await Listing.find({ isAvailable: true }).sort({
      createdAt: -1,
    });

    console.log(`Found ${listings.length} available listings`);
    console.log("Available listings data:", JSON.stringify(listings, null, 2));

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ listings }));
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Server error" }));
  }
};

/* DEBUG: Fetch ALL listings (including unavailable) */
export const getAllListingsDebug = async (req, res) => {
  try {
    console.log("DEBUG: Fetching ALL listings from database...");
    const allListings = await Listing.find({}).sort({
      createdAt: -1,
    });

    console.log(
      `DEBUG: Found ${allListings.length} total listings in database`,
    );
    console.log(
      "DEBUG: All listings data:",
      JSON.stringify(allListings, null, 2),
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Debug - All listings",
        count: allListings.length,
        listings: allListings,
      }),
    );
  } catch (error) {
    console.error("DEBUG: Error fetching all listings:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Server error", error: error.message }));
  }
};

/* GET USER'S LISTINGS */
export const getMyListings = async (req, res) => {
  const isAuthorized = await auth(req, res);
  if (!isAuthorized) return;

  try {
    console.log("Fetching listings for user:", req.userId);
    const listings = await Listing.find({ owner: req.userId }).sort({
      createdAt: -1,
    });

    console.log(`Found ${listings.length} listings for user ${req.userId}`);
    console.log("User listings data:", JSON.stringify(listings, null, 2));

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ listings }));
  } catch (error) {
    console.error("Error fetching user listings:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Server error", error: error.message }));
  }
};

/* READ ONE */
export const getListing = async (req, res, id) => {
  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Listing not found" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ listing }));
  } catch {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Server error" }));
  }
};

/* UPDATE */
export const updateListing = async (req, res, id) => {
  try {
    const body = await getRequestBody(req);
    const listing = await Listing.findById(id);

    if (!listing) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Listing not found" }));
    }

    Object.assign(listing, body);
    await listing.save();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, listing }));
  } catch {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Server error" }));
  }
};

/* DELETE */
export const deleteListing = async (req, res, id) => {
  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Listing not found" }));
    }

    await listing.deleteOne();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, message: "Deleted" }));
  } catch {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Server error" }));
  }
};
