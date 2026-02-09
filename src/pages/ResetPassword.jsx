import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../utils/api.js";
import "../styles/reset-password.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [step, setStep] = useState("form"); // 'form', 'success', 'error'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tokenFromUrl = query.get("token");

    if (!tokenFromUrl) {
      setStep("error");
      setMessage("Invalid or missing reset token");
    } else {
      setToken(tokenFromUrl);
    }
  }, [location.search]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/reset-password", {
        token,
        newPassword: formData.newPassword,
      });

      setStep("success");
      setMessage("Password has been reset successfully!");
    } catch (error) {
      setStep("error");
      setMessage(
        error.response?.data?.message ||
          "Failed to reset password. The link may have expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendLink = async () => {
    const email = prompt("Please enter your email to resend reset link:");
    if (email) {
      try {
        await API.post("/auth/forgot-password", { email });
        alert("Password reset link has been resent to your email.");
      } catch (error) {
        alert("Failed to resend reset link. Please try again.");
      }
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="logo-section">
          <img
            src="/images/icons/logo.png"
            alt="HomeLink Logo"
            className="logo"
          />
          <h2>HomeLink</h2>
        </div>

        {step === "form" && (
          <>
            <h3>Reset Your Password</h3>
            <p className="subtitle">Enter your new password below</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password (min. 6 characters)"
                    className={errors.newPassword ? "error" : ""}
                  />
                </div>
                {errors.newPassword && (
                  <p className="error-text">{errors.newPassword}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    className={errors.confirmPassword ? "error" : ""}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="error-text">{errors.confirmPassword}</p>
                )}
              </div>

              <button type="submit" className="btn-reset" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Resetting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-key"></i> Reset Password
                  </>
                )}
              </button>
            </form>

            <div className="password-requirements">
              <p>
                <strong>Password Requirements:</strong>
              </p>
              <ul>
                <li>At least 6 characters long</li>
                <li>Use a combination of letters and numbers</li>
                <li>Avoid common passwords</li>
              </ul>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="success-section">
            <div className="icon success-icon">
              <i className="fas fa-check-circle fa-3x"></i>
            </div>
            <h3>Password Reset Successful!</h3>
            <p className="success-message">{message}</p>
            <button className="btn-login" onClick={() => navigate("/")}>
              <i className="fas fa-sign-in-alt"></i> Go to Login
            </button>
          </div>
        )}

        {step === "error" && (
          <div className="error-section">
            <div className="icon error-icon">
              <i className="fas fa-times-circle fa-3x"></i>
            </div>
            <h3>Reset Failed</h3>
            <p className="error-message">{message}</p>

            <div className="error-actions">
              <button className="btn-resend" onClick={handleResendLink}>
                <i className="fas fa-redo"></i> Resend Reset Link
              </button>
              <button className="btn-home" onClick={() => navigate("/")}>
                <i className="fas fa-home"></i> Back to Home
              </button>
            </div>
          </div>
        )}

        <div className="links">
          <Link to="/">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
          <Link to="/">
            <i className="fas fa-user-plus"></i> Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
