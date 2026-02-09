import express from "express";
import { auth } from "../middleware/auth.js";
import {
  saveListing,
  unsaveListing,
  getSavedListings,
  checkIfSaved,
} from "../controllers/savedListingController.js";

const router = express.Router();

router.use(auth); // All routes require authentication

router.post("/", saveListing);
router.delete("/:listingId", unsaveListing);
router.get("/", getSavedListings);
router.get("/check/:listingId", checkIfSaved);

export default router;
