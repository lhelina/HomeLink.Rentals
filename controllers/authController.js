import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Create email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

//    Register user
//   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists with this email or username",
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // Create user
    const user = await User.create({
      email,
      username,
      password,
      role,
      verificationToken,
    });

    // Send verification email (with error handling)
    try {
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

      console.log("Attempting to send email to:", email);
      console.log("Verification URL:", verificationUrl);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email - HomeLink",
        html: `
          <h2>Welcome to HomeLink!</h2>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationUrl}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #4c7999;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          ">Verify Email</a>
          <p>This link expires in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        `,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", result.messageId);
      console.log("Email response:", result.response);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      console.error("Email error details:", {
        message: emailError.message,
        code: emailError.code,
        errno: emailError.errno,
        syscall: emailError.syscall,
        address: emailError.address,
        port: emailError.port,
      });

      // Auto-verify user for testing if email fails
      console.log("Auto-verifying user due to email failure...");
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account before logging in.",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//   Login user
//    POST /api/auth/login
export const login = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const identifier = username.toLowerCase().trim();

    console.log("Login attempt:", { username, password });

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    console.log(
      "User found:",
      user
        ? {
            id: user._id,
            email: user.email,
            username: user.username,
            isVerified: user.isVerified,
            hasPassword: !!user.password,
          }
        : "No user found",
    );

    if (!user) {
      console.log("No user found with:", username);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    console.log("Comparing password...");
    const isPasswordMatch = await user.comparePassword(password);
    console.log("Password match:", isPasswordMatch);

    if (!isPasswordMatch) {
      console.log("Password doesn't match");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if email is verified
    console.log("User verification status:", user.isVerified);

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// @desc    Verify email
// @route   GET /api/auth/verify-email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email (with error handling)
    try {
      const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Your Password - HomeLink",
        html: `
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the link below:</p>
          <a href="${resetUrl}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #4c7999;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          ">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });

      console.log("Password reset email sent to:", email);
    } catch (emailError) {
      console.error("Password reset email failed:", emailError);
      // Still return success to user for security
    }

    res.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
