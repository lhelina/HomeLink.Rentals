import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";

const Navbar = ({ currentPage = "home" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const getNavLinks = () => {
    const baseLinks = [
      {
        to: "/",
        icon: "fas fa-home",
        text: "Home",
        active: currentPage === "home",
      },
      {
        to: "/listing",
        icon: "fas fa-list",
        text: "Listing",
        active: currentPage === "listing",
      },
    ];

    if (user) {
      baseLinks.push(
        {
          to: user.role === "owner" ? "/ownerdashboard" : "/renterdashboard",
          icon: "fas fa-tachometer-alt",
          text: "Dashboard",
          active: currentPage === "dashboard",
        },
        {
          to: "#",
          icon: "fas fa-sign-out-alt",
          text: "Logout",
          action: logout,
          active: false,
        },
      );
      if (user.role === "owner") {
        baseLinks.push({
          to: "/ownerdashboard",
          icon: "fas fa-plus-circle",
          text: "Post home",
          active: false,
        });
      }
    } else {
      baseLinks.push(
        {
          to: "#",
          icon: "fas fa-sign-in-alt",
          text: "Login",
          action: () => setLoginModalOpen(true),
          active: false,
        },
        {
          to: "/ownerdashboard",
          icon: "fas fa-plus-circle",
          text: "Post home",
          active: false,
        },
      );
    }

    return baseLinks;
  };

  const handleLinkClick = (link) => {
    console.log("Link clicked:", link);
    if (link.action) {
      link.action();
    } else if (link.text === "Login") {
      console.log("Opening login modal");
      setLoginModalOpen(true);
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      <nav className="navbar">
        <div className="logo-section">
          <img src="/images/icons/logo.png" alt="HomeLink Logo" />
          <p className="brand-text">
            <span className="brand-main">HomeLink</span>
            <br />
            <span className="brand-sub">Rentals</span>
          </p>
        </div>

        <div className="nav-links">
          {navLinks.map((link) =>
            link.to === "#" ? (
              <button
                key={link.text}
                className={`nav-link-btn ${link.active ? "active-link" : ""}`}
                onClick={() => handleLinkClick(link)}
              >
                <i className={link.icon}></i> {link.text}
              </button>
            ) : (
              <Link
                key={link.text}
                to={link.to}
                className={`${link.active ? "active-link" : "nav-link"}`}
              >
                <i className={link.icon}></i> {link.text}
              </Link>
            ),
          )}
        </div>

        <div className="menu-icon" onClick={() => setSidebarOpen(true)}>
          <i className="fas fa-bars"></i>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button onClick={() => setSidebarOpen(false)}>×</button>
        {navLinks.map((link) =>
          link.to === "#" ? (
            <button
              key={link.text}
              className="sidebar-link"
              onClick={() => {
                handleLinkClick(link);
                setSidebarOpen(false);
              }}
            >
              <i className={link.icon}></i> {link.text}
            </button>
          ) : (
            <Link
              key={link.text}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={link.icon}></i> {link.text}
            </Link>
          ),
        )}
      </nav>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      {console.log("Navbar render - loginModalOpen:", loginModalOpen)}
    </>
  );
};

export default Navbar;
