import React, { useState, useEffect } from "react";
import "../styles/edit-listing-modal.css";
import "../styles/listing-details-modal.css";
import API from "../utils/api";

const ListingDetailsModal = ({ isOpen, onClose, listing }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if listing is saved when modal opens
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!listing?._id) return;

      try {
        const { data } = await API.get(`/saved-listings/check/${listing._id}`);
        setIsSaved(data.isSaved);
      } catch (error) {
        console.error("Error checking if saved:", error);
      }
    };

    if (isOpen && listing) {
      checkIfSaved();
    }
  }, [listing, isOpen]);

  if (!isOpen || !listing) return null;

  const features = listing.features || [];

  const handleSaveToggle = async () => {
    setLoading(true);
    try {
      if (isSaved) {
        await API.delete(`/saved-listings/${listing._id}`);
        setIsSaved(false);
      } else {
        await API.post("/saved-listings", { listingId: listing._id });
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      alert(error.response?.data?.message || "Failed to save listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Property Details</h2>
          <span
            onClick={onClose}
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#666",
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: "0",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
            }}
          >
            &times;
          </span>
        </div>

        <div className="listing-details">
          {/* Header with Image */}
          <div className="listing-details-header">
            {listing.images && listing.images.length > 0 ? (
              <img
                src={`http://localhost:5000${listing.images[0]}`}
                alt={listing.title}
                className="listing-details-image"
              />
            ) : (
              <div className="listing-details-image no-image">No Image</div>
            )}
            <div className="listing-details-info">
              <h2>{listing.title}</h2>
              <div className="listing-details-price">
                <strong>{listing.price.toLocaleString()} ETB</strong> / month
              </div>
              <div className="listing-details-status">
                <span
                  className={`status ${listing.isAvailable ? "status-avail" : "status-rented"}`}
                >
                  {listing.isAvailable ? "Available" : "Rented"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="listing-details-contact">
            <h3>
              <i className="fas fa-phone-alt"></i> Contact Information
            </h3>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>
                  <strong>Phone:</strong>{" "}
                  {listing.phoneNumber || "Not provided"}
                </span>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>
                  <strong>Location:</strong> {listing.location}
                </span>
              </div>
              <div className="contact-item">
                <i className="fas fa-home"></i>
                <span>
                  <strong>Address:</strong> {listing.address}
                </span>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="listing-details-property">
            <h3>
              <i className="fas fa-info-circle"></i> Property Details
            </h3>
            <div className="property-grid">
              <div className="property-item">
                <i className="fas fa-building"></i>
                <span>
                  <strong>Type:</strong> {listing.propertyType}
                </span>
              </div>
              {listing.bedrooms > 0 && (
                <div className="property-item">
                  <i className="fas fa-bed"></i>
                  <span>
                    <strong>Bedrooms:</strong> {listing.bedrooms}
                  </span>
                </div>
              )}
              {listing.bathrooms > 0 && (
                <div className="property-item">
                  <i className="fas fa-bath"></i>
                  <span>
                    <strong>Bathrooms:</strong> {listing.bathrooms}
                  </span>
                </div>
              )}
              {listing.area > 0 && (
                <div className="property-item">
                  <i className="fas fa-ruler-combined"></i>
                  <span>
                    <strong>Area:</strong> {listing.area} sqm
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="listing-details-description">
            <h3>
              <i className="fas fa-file-alt"></i> Description
            </h3>
            <p>{listing.description}</p>
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div className="listing-details-features">
              <h3>
                <i className="fas fa-star"></i> Features & Amenities
              </h3>
              <div className="features-list">
                {features.map((feature, index) => (
                  <span key={index} className="feature-tag">
                    <i className="fas fa-check"></i> {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="listing-details-actions">
            <button
              className={`btn ${isSaved ? "btn-saved" : "btn-save"}`}
              onClick={handleSaveToggle}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Processing...
                </>
              ) : isSaved ? (
                <>
                  <i className="fas fa-heart"></i> Saved
                </>
              ) : (
                <>
                  <i className="far fa-heart"></i> Save Listing
                </>
              )}
            </button>

            <button className="btn btn-accent" onClick={onClose}>
              <i className="fas fa-phone"></i> Contact Owner
            </button>

            <button className="btn btn-secondary" onClick={onClose}>
              <i className="fas fa-times"></i> Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsModal;
