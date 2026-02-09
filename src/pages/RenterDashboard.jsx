import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/renter-dashboard.css";
import "../styles/listing.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatCard from "../components/StatCard";
import ListingDetailsModal from "../components/ListingDetailsModal";
import API from "../utils/api";

import { statsData } from "../data/renterDashboardData";

const RenterDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/");
    }
  };

  return (
    <>
      <Navbar currentPage="renterdashboard" />

      {/* MAIN CONTENT */}
      <main className="dashboard-content">
        <h1>My Dashboard</h1>

        {/* QUICK STATS */}
        <div className="stats-grid">
          {statsData.map((stat) => (
            <StatCard
              key={stat.id}
              icon={stat.icon}
              number={stat.number}
              label={stat.label}
            />
          ))}
        </div>

        {/* SAVED LISTINGS */}
        <section className="dashboard-section">
          <h2>
            <i className="fas fa-bookmark icon-dark"></i> Your Saved Listings
          </h2>

          {loading ? (
            <p>Loading saved listings...</p>
          ) : savedListings.length === 0 ? (
            <div className="no-saved-listings">
              <i className="fas fa-heart"></i>
              <h3>No Saved Properties Yet</h3>
              <p>Start browsing and save properties you're interested in!</p>
              <Link to="/listing" className="btn btn-accent">
                <i className="fas fa-search"></i> Browse Properties
              </Link>
            </div>
          ) : (
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
          )}
        </section>

        {/* APPLICATION STATUS */}
        <section className="dashboard-section">
          <h2>
            <i className="fas fa-clipboard-list icon-dark"></i> Application
            Status
          </h2>

          <div className="application-list">
            <div className="application-item status-pending">
              <div>
                <p>
                  <strong>Villa near Africa Avenue</strong>
                </p>
                <p className="application-date">Applied: 2 days ago</p>
              </div>
              <span className="status-badge">Pending Review</span>
            </div>

            <div className="application-item status-approved">
              <div>
                <p>
                  <strong>Single Room, Kazanchis</strong>
                </p>
                <p className="application-date">Applied: 1 week ago</p>
              </div>
              <span className="status-badge">Approved!</span>
            </div>

            <div className="application-item status-viewed">
              <div>
                <p>
                  <strong>Shared Apartment, Bole</strong>
                </p>
                <p className="application-date">Applied: 3 days ago</p>
              </div>
              <span className="status-badge">Viewed by Owner</span>
            </div>
          </div>
        </section>

        {/* RECENTLY VIEWED */}
        <section className="dashboard-section">
          <h2>
            <i className="fas fa-history icon-dark"></i> Recently Viewed
          </h2>

          <div className="card-list">
            <div className="listing-preview">
              <img
                src="/images/listings/house_for_rent5.jpg"
                alt="Villa view"
              />
              <div className="listing-details">
                <h3>Spacious Villa in Old Airport</h3>
                <p>📍 Old Airport, Addis Ababa | 💰 25,000 ETB/month</p>
                <button className="btn-primary">View Again</button>
              </div>
            </div>
          </div>
        </section>
      </main>

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

export default RenterDashboard;
