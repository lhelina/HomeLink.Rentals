import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/owner-dashboard.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import API from "../utils/api";
import EditListingModal from "../components/EditListingModal";

const OwnerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    location: "",
    propertyType: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    features: "",
    phoneNumber: "",
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [error, setError] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const { data } = await API.get("/listings/user/my-listings");

      setListings(data.listings);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append images
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const { data } = await API.post("/listings", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(data.message);

      // Reset form
      setFormData({
        title: "",
        description: "",
        address: "",
        location: "",
        propertyType: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        features: "",
        phoneNumber: "",
      });
      setImages([]);
      setPreviewImages([]);

      // Refresh listings
      fetchMyListings();
    } catch (error) {
      console.error("Failed to create listing:", error);
      alert(error.response?.data?.message || "Failed to create listing");
    }
  };
  const handleEditListing = (listing) => {
    setSelectedListing(listing);
    setShowEditModal(true);
  };

  const handleUpdateListingStatus = async (listingId, isAvailable) => {
    if (
      window.confirm(
        `Are you sure you want to mark this property as ${isAvailable ? "Available" : "Rented"}?`,
      )
    ) {
      try {
        const { data } = await API.patch(`/listings/${listingId}`, {
          isAvailable,
        });

        if (data.success) {
          // Update local state
          setListings(
            listings.map((listing) =>
              listing._id === listingId ? { ...listing, isAvailable } : listing,
            ),
          );
        }
      } catch (error) {
        console.error("Failed to update status:", error);
        alert("Failed to update status. Please try again.");
      }
    }
  };
  const handleDeleteListing = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await API.delete(`/listings/${id}`);
        fetchMyListings();
      } catch (error) {
        console.error("Failed to delete listing:", error);
      }
    }
  };
  const handleUpdateListing = (updatedListing) => {
    // Update local state with edited listing
    setListings(
      listings.map((listing) =>
        listing._id === updatedListing._id ? updatedListing : listing,
      ),
    );
  };

  return (
    <>
      <Navbar currentPage="ownerdashboard" />

      {/* MAIN */}
      <div className="container">
        <h1>Dashboard Overview</h1>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <i className="fas fa-home stat-icon"></i>
            <div className="stat-info">
              <strong>{listings.length}</strong>
              <p>Total Listings</p>
            </div>
          </div>

          <div className="stat-card">
            <i className="fas fa-phone-alt stat-icon"></i>
            <div className="stat-info">
              <strong>10</strong>
              <p>New Inquiries</p>
            </div>
          </div>

          <div className="stat-card stat-accent">
            <i className="fas fa-check-circle stat-icon"></i>
            <div className="stat-info">
              <strong>{listings.filter((l) => l.isAvailable).length}</strong>
              <p>Active Rentals</p>
            </div>
          </div>
        </div>

        {/* POST FORM */}
        <div className="post-form-section">
          <h2>Post a New Property</h2>

          <form onSubmit={handleSubmit} className="post-grid">
            <div className="upload-box">
              <p>Upload Property Photos (up to 5MB each)</p>

              {previewImages.length > 0 && (
                <div className="image-previews">
                  {previewImages.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />
                  ))}
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </div>

            <div className="input-group input-labeled">
              <label className="input-label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., 2 Bedroom Apartment"
                required
              />
            </div>

            <div className="input-group input-labeled full-width">
              <label className="input-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property..."
                rows="3"
                required
              />
            </div>

            <div className="input-group input-labeled">
              <label className="input-label">Full Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Full street address"
                required
              />
            </div>

            <div className="input-group input-labeled">
              <label className="input-label">Area/Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Bole, Sarbet"
                required
              />
            </div>

            <div className="input-group input-labeled">
              <label className="input-label">Property Type</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Type</option>
                <option>Apartment</option>
                <option>Condominium</option>
                <option>Villa</option>
                <option>Single Room</option>
                <option>Shared Room</option>
                <option>Office Space</option>
              </select>
            </div>

            <div className="input-group input-labeled">
              <label className="input-label">Price (ETB/month)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 20000"
                required
              />
            </div>

            <div className="input-group input-labeled">
              <label className="input-label">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                placeholder="Number of bedrooms"
              />
            </div>

            <div className="input-group input-labeled">
              <label className="input-label">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                placeholder="Number of bathrooms"
              />
            </div>

            <div className="input-group input-labeled">
              <label className="input-label">Area (sqm)</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="Area in square meters"
              />
            </div>

            <div className="input-group input-labeled">
              <label className="input-label">Features (comma separated)</label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="e.g., WiFi, Parking, Garden"
              />
            </div>

            <div className="input-group input-labeled">
              <label className="input-label">Work Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="e.g., 0912345678 or +251912345678"
                required
              />
            </div>

            <button className="btn btn-accent btn-post" type="submit">
              <i className="fas fa-paper-plane"></i> Post Property
            </button>
          </form>
        </div>

        {/* ACTIVE LISTINGS */}
        <h2 className="section-title">
          Your Active Listings ({listings.length})
        </h2>

        {loading ? (
          <p>Loading listings...</p>
        ) : (
          <div className="list-grid">
            {listings.map((item) => (
              <div key={item._id} className="post-card">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000/uploads/${item.images[0]}`}
                    alt={item.title}
                    className="card-img"
                  />
                ) : (
                  <div className="card-img no-image">No Image</div>
                )}

                <div className="card-body">
                  <h3>{item.title}</h3>
                  <p className="description">
                    {item.description.substring(0, 100)}...
                  </p>

                  <div className="card-details">
                    <p className="detail-item">
                      <i className="fas fa-map-marker-alt"></i> {item.location}
                    </p>

                    <p className="detail-item">
                      <i className="fas fa-money-bill-wave"></i>{" "}
                      {item.price.toLocaleString()} ETB
                    </p>

                    <p className="detail-item">
                      <i className="fas fa-home"></i> {item.propertyType}
                    </p>

                    <p
                      className={`detail-item status ${
                        item.isAvailable ? "status-avail" : "status-rented"
                      }`}
                    >
                      <i className="fas fa-info-circle"></i>{" "}
                      {item.isAvailable ? "Available" : "Rented"}
                    </p>

                    <div className="card-actions">
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEditListing(item)} // Add this onClick
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        className={`btn ${item.isAvailable ? "btn-status-available" : "btn-status-rented"}`}
                        onClick={() =>
                          handleUpdateListingStatus(item._id, !item.isAvailable)
                        }
                      >
                        <i
                          className={`fas ${item.isAvailable ? "fa-check-circle" : "fa-times-circle"}`}
                        ></i>
                        {item.isAvailable
                          ? "Mark as Rented"
                          : "Mark as Available"}
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteListing(item._id)}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      {/* Edit Modal */}
      {showEditModal && (
        <EditListingModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedListing(null);
          }}
          listing={selectedListing}
          onUpdate={handleUpdateListing}
        />
      )}
    </>
  );
};

export default OwnerDashboard;
