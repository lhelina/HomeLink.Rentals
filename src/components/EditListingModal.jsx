import { useState, useEffect } from "react";
import API from "../utils/api";
import "../styles/edit-listing-modal.css";

const EditListingModal = ({ isOpen, onClose, listing, onUpdate }) => {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title || "",
        description: listing.description || "",
        address: listing.address || "",
        location: listing.location || "",
        propertyType: listing.propertyType || "",
        price: listing.price || "",
        bedrooms: listing.bedrooms || "",
        bathrooms: listing.bathrooms || "",
        area: listing.area || "",
        features: listing.features?.join(", ") || "",
        phoneNumber: listing.phoneNumber || "",
      });
      setPreviewImages(listing.images || []);
    }
  }, [listing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file size (5MB max)
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);

    if (validFiles.length !== files.length) {
      setError("Some files exceed 5MB limit and were not selected.");
    }

    setImages(validFiles);

    // Create preview URLs for new images
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);

    // If it's a new image (not from server), remove from images array too
    if (index >= (listing?.images?.length || 0)) {
      const newImages = [...images];
      const adjustedIndex = index - (listing?.images?.length || 0);
      newImages.splice(adjustedIndex, 1);
      setImages(newImages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();

      // Append form data
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append new images
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const { data } = await API.put(
        `/listings/${listing._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        setSuccess("Listing updated successfully!");
        setTimeout(() => {
          onUpdate(data.listing);
          onClose();
        }, 1500);
      } else {
        setError(data.message || "Failed to update listing");
      }
    } catch (error) {
      console.error("Failed to update listing:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update listing. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !listing) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Property Listing</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., 2 Bedroom Apartment"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property..."
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Full street address"
                required
              />
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Bole, Sarbet"
                required
              />
            </div>

            <div className="form-group">
              <label>Property Type *</label>
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

            <div className="form-group">
              <label>Price (ETB/month) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 20000"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                placeholder="Number of bedrooms"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                placeholder="Number of bathrooms"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Area (sqm)</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="Area in square meters"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Features (comma separated)</label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="e.g., WiFi, Parking, Garden, AC"
              />
            </div>

            <div className="form-group">
              <label>Work Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="e.g., 0912345678 or +251912345678"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Property Images</label>
              <div className="image-upload-section">
                <div className="image-previews">
                  {previewImages.map((image, index) => (
                    <div key={index} className="image-preview-item">
                      <img
                        src={
                          image.startsWith("/uploads")
                            ? `http://localhost:5000${image}`
                            : image
                        }
                        alt={`Preview ${index + 1}`}
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="upload-controls">
                  <input
                    type="file"
                    id="edit-images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                  <label htmlFor="edit-images" className="btn btn-secondary">
                    <i className="fas fa-camera"></i> Add More Images
                  </label>
                  <small>Upload new images (max 5MB each)</small>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-save" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingModal;
