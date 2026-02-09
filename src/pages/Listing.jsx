import { useState, useEffect } from "react";
import "../styles/listing.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import API from "../utils/api";
import ListingDetailsModal from "../components/ListingDetailsModal";

const Listing = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
  });
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await API.get(`/listings?${params}`);
      setListings(data.listings);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchListings(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      location: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
    });
    fetchListings();
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleViewDetails = (listing) => {
    setSelectedListing(listing);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedListing(null);
  };

  return (
    <>
      <Navbar currentPage="listing" />

      {/* LISTING PAGE */}
      <div className="container listing-page">
        <h1>Property Listings</h1>

        <div className="listing-main-content">
          {/* FILTER SIDEBAR */}
          <aside className="listing-sidebar">
            <h3>
              <i className="fas fa-filter"></i> Filter Listings
            </h3>

            <form className="filter-form" onSubmit={handleApplyFilters}>
              <div className="filter-group">
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="e.g., Bole, Sarbet"
                />
              </div>

              <div className="filter-group">
                <label>Property Type:</label>
                <select
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option>Apartment</option>
                  <option>Condominium</option>
                  <option>Villa</option>
                  <option>Single Room</option>
                  <option>Shared Room</option>
                  <option>Office Space</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Min Price (ETB):</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min price"
                />
              </div>

              <div className="filter-group">
                <label>Max Price (ETB):</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max price"
                />
              </div>

              <button className="btn btn-primary btn-apply" type="submit">
                <i className="fas fa-search"></i> Apply Filters
              </button>

              <button
                type="button"
                className="btn btn-logout btn-clear"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </form>
          </aside>

          {/* LISTING RESULTS */}
          <main className="listing-results">
            <h2>Showing {listings.length} Results</h2>

            {loading ? (
              <p>Loading listings...</p>
            ) : (
              <div className="list-grid">
                {listings.map((item) => (
                  <div key={item._id} className="post-card listing-card">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000${item.images[0]}`}
                        alt={item.title}
                        className="card-img"
                      />
                    ) : (
                      <div className="card-img no-image">No Image</div>
                    )}

                    <div className="card-body">
                      <h3>{item.title}</h3>
                      <p className="listing-price">
                        <strong>{item.price.toLocaleString()} ETB</strong> /
                        month
                      </p>
                      <p className="listing-location">
                        <i className="fas fa-map-marker-alt"></i>{" "}
                        {item.location}
                      </p>
                      <p className="description">
                        {item.description.substring(0, 150)}...
                      </p>

                      <div className="listing-features">
                        {item.bedrooms > 0 && <span>{item.bedrooms} Bed</span>}
                        {item.bathrooms > 0 && (
                          <span>{item.bathrooms} Bath</span>
                        )}
                        {item.area > 0 && <span>{item.area} sqm</span>}
                        {item.features &&
                          item.features
                            .slice(0, 2)
                            .map((feature, index) => (
                              <span key={index}>{feature}</span>
                            ))}
                      </div>

                      <a
                        className="btn btn-accent btn-view-details"
                        onClick={() => handleViewDetails(item)}
                        style={{ cursor: "pointer" }}
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
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

export default Listing;
