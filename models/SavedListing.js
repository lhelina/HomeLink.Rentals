import mongoose from "mongoose";

const savedListingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Ensure a user can only save a listing once
savedListingSchema.index({ user: 1, listing: 1 }, { unique: true });

const SavedListing = mongoose.model("SavedListing", savedListingSchema);
export default SavedListing;
