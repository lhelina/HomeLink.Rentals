import React, { useState } from "react";
import "../styles/home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  const [searchForm, setSearchForm] = useState({
    location: "",
    type: "",
    priceRange: "",
  });
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search form submitted:", searchForm);
  };

  return (
    <div>
      <Navbar currentPage="home" />
      <div id="hero-container">
        {/* Hero Section */}
        <h1 className="hero-title">Find Your Home in Ethiopia, Easily.</h1>
        <p className="description">
          Discover your perfect rental property on HomeLink.
        </p>
        <div className="center-btn">
          <Link to="/listing" className="browse-btn">
            <i className="fas fa-search-dollar"></i> Browse Listings
          </Link>
        </div>

        {/* Search Form */}
        <div className="search-container">
          <form className="search-list" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Location, e.g, Bole, Addis Ababa"
              required
              name="location"
              value={searchForm.location}
              onChange={handleSearchChange}
            />
            <select
              required
              name="type"
              value={searchForm.type}
              onChange={handleSearchChange}
            >
              <option value="">Type</option>
              <option value="apartment">Apartment</option>
              <option value="condominium">Condominium</option>
              <option value="villa">Villa</option>
              <option value="single-room">Single Room</option>
              <option value="shared-room">Shared Room</option>
              <option value="office-space">Office Space</option>
            </select>
            <select
              required
              name="priceRange"
              value={searchForm.priceRange}
              onChange={handleSearchChange}
            >
              <option value="">Price Range</option>
              <option value="below-5000">Below 5,000 ETB</option>
              <option value="5000-10000">5,000 – 10,000 ETB</option>
              <option value="10000-20000">10,000 – 20,000 ETB</option>
              <option value="20000-40000">20,000 – 40,000 ETB</option>
              <option value="40000-plus">40,000+ ETB</option>
            </select>
            <button type="submit">
              <i className="fas fa-search"></i> Search
            </button>
          </form>
        </div>
      </div>
      {/* How it works */}
      <section className="how-it-works">
        <h2>
          <i className="fas fa-cogs"></i> How it works
        </h2>
        <div className="hiw-grid">
          <div className="hiw-card">
            <i className="fas fa-file-upload fa-3x"></i>
            <h3>Post</h3>
            <p>Post property for free.</p>
          </div>
          <div className="hiw-card">
            <i className="fas fa-search fa-3x"></i>
            <h3>Search</h3>
            <p>Find your ideal rental.</p>
          </div>
          <div className="hiw-card">
            <i className="fas fa-phone-alt fa-3x"></i>
            <h3>Contact</h3>
            <p>Contact the property owner.</p>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="our-services">
        <h2>
          <i className="fas fa-concierge-bell"></i> Our Services
        </h2>
        <div className="services-grid">
          <div className="service-card">
            <i className="fas fa-house-user fa-4x"></i>
            <h3>Houses</h3>
          </div>
          <div className="service-card">
            <i className="fas fa-building fa-4x"></i>
            <h3>Apartments</h3>
          </div>
          <div className="service-card">
            <i className="fas fa-user-friends fa-4x"></i>
            <h3>Shared Rooms</h3>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
