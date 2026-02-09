import { useState, useEffect } from "react";
import "../styles/listing.css";
import "../styles/saved-listings.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ListingDetailsModal from "../components/ListingDetailsModal";
import API from "../utils/api";

const SavedListings = () => {
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchSavedListings();
  }, []);

  const fetchSavedListings = async () => {
    try {
      const { data } = await API.get("/saved-listings");
      setSavedListings(data.savedListings);
    } catch (error) {
      console.error("Failed to fetch saved listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (listing) => {
    setSelectedListing(listing);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedListing(null);
  };

  const handleListingUpdate = () => {
    // Refresh saved listings after any changes
    fetchSavedListings();
  };

  return (
    <>
      <Navbar currentPage="saved" />

      {/* SAVED LISTINGS PAGE */}
      <div className="container listing-page">
        <h1>My Saved Properties</h1>

        {loading ? (
          <p>Loading saved listings...</p>
        ) : savedListings.length === 0 ? (
          <div className="no-saved-listings">
            <i className="fas fa-heart"></i>
            <h3>No Saved Properties Yet</h3>
            <p>Start browsing and save properties you're interested in!</p>
            <a href="/listing" className="btn btn-accent">
              <i className="fas fa-search"></i> Browse Properties
            </a>
          </div>
        ) : (
          <div className="listing-results">
            <h2>Showing {savedListings.length} Saved Properties</h2>
            <div className="list-grid">
              {savedListings.map((savedItem) => (
                <div key={savedItem._id} className="post-card listing-card">
                  {savedItem.listing.images &&
                  savedItem.listing.images.length > 0 ? (
                    <img
                      src={`http://localhost:5000${savedItem.listing.images[0]}`}
                      alt={savedItem.listing.title}
                      className="card-img"
                    />
                  ) : (
                    <div className="card-img no-image">No Image</div>
                  )}

                  <div className="card-body">
                    <h3>{savedItem.listing.title}</h3>
                    <p className="listing-price">
                      <strong>
                        {savedItem.listing.price.toLocaleString()} ETB
                      </strong>{" "}
                      / month
                    </p>
                    <p className="listing-location">
                      <i className="fas fa-map-marker-alt"></i>{" "}
                      {savedItem.listing.location}
                    </p>
                    <p className="description">
                      {savedItem.listing.description.substring(0, 150)}...
                    </p>

                    <div className="listing-features">
                      {savedItem.listing.bedrooms > 0 && (
                        <span>{savedItem.listing.bedrooms} Bed</span>
                      )}
                      {savedItem.listing.bathrooms > 0 && (
                        <span>{savedItem.listing.bathrooms} Bath</span>
                      )}
                      {savedItem.listing.area > 0 && (
                        <span>{savedItem.listing.area} sqm</span>
                      )}
                      {savedItem.listing.features &&
                        savedItem.listing.features
                          .slice(0, 2)
                          .map((feature, index) => (
                            <span key={index}>{feature}</span>
                          ))}
                    </div>

                    <div className="saved-date">
                      <i className="fas fa-heart"></i> Saved on{" "}
                      {new Date(savedItem.createdAt).toLocaleDateString()}
                    </div>

                    <a
                      className="btn btn-accent btn-view-details"
                      onClick={() => handleViewDetails(savedItem.listing)}
                      style={{ cursor: "pointer" }}
                    >
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <Footer />

      {/* Listing Details Modal */}
      <ListingDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseModal}
        listing={selectedListing}
      />
    </>
  );
};

export default SavedListings;
