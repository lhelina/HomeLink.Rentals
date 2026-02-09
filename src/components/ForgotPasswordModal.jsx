import React, { useState } from "react";
import API from "../utils/api.js";
import "../styles/forgot-password-modal.css";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await API.post("/auth/forgot-password", { email });
      setIsSuccess(true);
      setMessage("Password reset link has been sent to your email!");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to send reset link. Please try again.",
      );
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="forgot-password-modal">
      <div className="modal-overlay" onClick={onClose}></div>

      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="modal-header">
          <i className="fas fa-key"></i>
          <h3>Reset Your Password</h3>
        </div>

        {!isSuccess ? (
          <>
            <p className="modal-description">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-send" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Send Reset Link
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <i className="fas fa-check-circle success-icon"></i>
            <p>{message}</p>
            <p className="note">
              Check your inbox and follow the instructions in the email. The
              link will expire in 1 hour.
            </p>
            <button className="btn-back" onClick={onClose}>
              <i className="fas fa-arrow-left"></i> Back to Login
            </button>
          </div>
        )}

        {message && !isSuccess && (
          <p className="error-message">
            <i className="fas fa-exclamation-circle"></i> {message}
          </p>
        )}

        <div className="help-text">
          <p>
            <i className="fas fa-info-circle"></i>
            Remember your password?{" "}
            <button className="text-link" onClick={onClose}>
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
