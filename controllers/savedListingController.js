import SavedListing from "../models/SavedListing.js";
import Listing from "../models/Listing.js";

//    Save a listing
//   POST /api/saved-listings
export const saveListing = async (req, res) => {
  try {
    const { listingId } = req.body;

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check if already saved
    const existingSave = await SavedListing.findOne({
      user: req.userId,
      listing: listingId,
    });

    if (existingSave) {
      return res.status(400).json({
        success: false,
        message: "Listing already saved",
      });
    }

    // Create saved listing
    const savedListing = await SavedListing.create({
      user: req.userId,
      listing: listingId,
    });

    res.status(201).json({
      success: true,
      message: "Listing saved successfully",
      savedListing,
    });
  } catch (error) {
    console.error("Save listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

//     Unsave a listing
//    DELETE /api/saved-listings/:listingId
export const unsaveListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const savedListing = await SavedListing.findOneAndDelete({
      user: req.userId,
      listing: listingId,
    });

    if (!savedListing) {
      return res.status(404).json({
        success: false,
        message: "Saved listing not found",
      });
    }

    res.json({
      success: true,
      message: "Listing unsaved successfully",
    });
  } catch (error) {
    console.error("Unsave listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get user's saved listings
// @route   GET /api/saved-listings
export const getSavedListings = async (req, res) => {
  try {
    const savedListings = await SavedListing.find({ user: req.userId })
      .populate({
        path: "listing",
        match: { isAvailable: true, isDeleted: false },
        populate: {
          path: "owner",
          select: "username email",
        },
      })
      .sort({ createdAt: -1 });

    // Filter out listings where populate didn't find a match (deleted/unavailable)
    const validListings = savedListings.filter(
      (saved) => saved.listing !== null,
    );

    res.json({
      success: true,
      savedListings: validListings,
    });
  } catch (error) {
    console.error("Get saved listings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Check if a listing is saved by current user
// @route   GET /api/saved-listings/check/:listingId
export const checkIfSaved = async (req, res) => {
  try {
    const { listingId } = req.params;

    const savedListing = await SavedListing.findOne({
      user: req.userId,
      listing: listingId,
    });

    res.json({
      success: true,
      isSaved: !!savedListing,
    });
  } catch (error) {
    console.error("Check if saved error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
