import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../utils/api.js";
import "../styles/verify-email.css";

const VerifyEmail = () => {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const query = new URLSearchParams(location.search);
      const token = query.get("token");

      if (!token) {
        setStatus("error");
        setMessage("No verification token provided");
        return;
      }

      try {
        const { data } = await API.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Email verification failed. Please try again.",
        );
      }
    };

    verifyEmail();
  }, [location.search]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <div className="verify-icon">
          {status === "verifying" && (
            <i className="fas fa-spinner fa-spin fa-3x"></i>
          )}
          {status === "success" && (
            <i className="fas fa-check-circle fa-3x success-icon"></i>
          )}
          {status === "error" && (
            <i className="fas fa-times-circle fa-3x error-icon"></i>
          )}
        </div>

        <h2>
          {status === "verifying" && "Verifying Your Email..."}
          {status === "success" && "Email Verified!"}
          {status === "error" && "Verification Failed"}
        </h2>

        <p className="status-message">{message}</p>

        <div className="action-buttons">
          {status === "success" && (
            <>
              <button className="btn-primary" onClick={() => navigate("/")}>
                <i className="fas fa-home"></i> Go to Home
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate("/login")}
              >
                <i className="fas fa-sign-in-alt"></i> Login Now
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <button className="btn-primary" onClick={() => navigate("/")}>
                <i className="fas fa-home"></i> Back to Home
              </button>
              <button
                className="btn-secondary"
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-redo"></i> Try Again
              </button>
            </>
          )}

          {status === "verifying" && (
            <p className="loading-text">
              Please wait while we verify your email...
            </p>
          )}
        </div>

        <div className="help-text">
          <p>
            <i className="fas fa-info-circle"></i>
            Having issues? Contact support at support@homelink.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
