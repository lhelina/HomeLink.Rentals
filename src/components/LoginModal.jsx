import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/loginModal.css";

const LoginModal = ({ isOpen, onClose }) => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    username: "",
    password: "",
    role: "renter",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginData,
      );

      localStorage.setItem("token", response.data.token);
      login(response.data.user);

      setError("Login successful! Redirecting...");

      setTimeout(() => {
        onClose();

        // Navigate to appropriate dashboard
        if (response.data.user.role === "owner") {
          navigate("/ownerdashboard");
        } else {
          navigate("/renterdashboard");
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Submitting registration:", registerData);
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        registerData,
      );

      // Show success message
      setError(
        "Registration successful! Please check your email to verify your account.",
      );

      // Clear form
      setRegisterData({
        email: "",
        username: "",
        password: "",
        role: "renter",
      });

      // Switch to login form after 3 seconds
      setTimeout(() => {
        setShowLoginForm(true);
        setError("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  console.log("Modal should be visible:", isOpen);

  return (
    <div className="modal" style={{ display: "flex" }}>
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {showLoginForm ? (
          <div id="login-form-section">
            <h3>
              <i className="fas fa-user-circle"></i> Login to HomeLink
            </h3>
            <form onSubmit={handleLoginSubmit}>
              <label>Username or Email</label>
              <input
                type="text"
                required
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                placeholder="Enter your username or email"
              />
              <label>Password</label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                placeholder="Enter your password"
              />
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
            <p className="switch-link">
              Don't have an account?{" "}
              <button
                onClick={() => setShowLoginForm(false)}
                style={{ cursor: "pointer", color: "#4c7999" }}
              >
                Create a new account now
              </button>
            </p>
          </div>
        ) : (
          <div id="register-form-section">
            <h3>
              <i className="fas fa-user-plus"></i> Create New Account
            </h3>
            <form onSubmit={handleRegisterSubmit}>
              <label>Email</label>
              <input
                type="email"
                required
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                placeholder="Enter your email"
              />
              <label>Username</label>
              <input
                type="text"
                required
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({ ...registerData, username: e.target.value })
                }
                placeholder="Choose a username"
              />
              <label>Password</label>
              <input
                type="password"
                required
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                placeholder="Create a password (min. 6 characters)"
              />
              <label>I am a:</label>
              <div
                style={{ display: "flex", gap: "15px", marginBottom: "15px" }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="renter"
                    checked={registerData.role === "renter"}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, role: e.target.value })
                    }
                    style={{ marginRight: "5px" }}
                  />
                  Renter (looking for properties)
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="owner"
                    checked={registerData.role === "owner"}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, role: e.target.value })
                    }
                    style={{ marginRight: "5px" }}
                  />
                  Owner (listing properties)
                </label>
              </div>
              <p className="note">Verification link will be emailed</p>
              <button type="submit" className="primary-btn">
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>
            <p className="switch-link">
              Already have an account?{" "}
              <button
                onClick={() => setShowLoginForm(true)}
                style={{ cursor: "pointer", color: "#4c7999" }}
              >
                Log In
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
