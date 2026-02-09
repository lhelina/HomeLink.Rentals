import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: [
        "Apartment",
        "Condominium",
        "Villa",
        "Single Room",
        "Shared Room",
        "Office Space",
      ],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        type: String, // Will store image paths
      },
    ],
    bedrooms: {
      type: Number,
      default: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
    },
    area: {
      type: Number, // in square meters
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    features: [String],
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^(\+251|0)?[9][0-9]{8}$/,
        "Please enter a valid Ethiopian phone number",
      ],
    },
  },
  {
    timestamps: true,
  },
);
listingSchema.index({ owner: 1, isDeleted: 1 });
listingSchema.index({ isDeleted: 1, isAvailable: 1 });
const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
