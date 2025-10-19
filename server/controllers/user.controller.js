import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import emailHelper from "../email/emailHelper.js";

export const registerUser = async (req, res) => {
  try {
    const user = new User(req.body);

    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      throw new Error("User already exists!");
    }

    await user.save();
    res.json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist, please register");
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }
    const userObj = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const token = await jwt.sign(userObj, process.env.JWT_SECRET);

    // Set token to cookie
    res.cookie("token", token, {
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      result: userObj,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const currentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "User fetched",
      result: req.user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    let userList;
    let totalItems;
    let totalPages = 1;
    let currentPage = 1;
    const isPaginated = page !== undefined || limit !== undefined;

    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (isPaginated) {
      currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(limit) || 4;
      const startIndex = (currentPage - 1) * itemsPerPage;
      totalItems = await User.countDocuments(searchQuery);
      totalPages = Math.ceil(totalItems / itemsPerPage);

      userList = await User.find(searchQuery)
        .select("-password")
        .skip(startIndex)
        .limit(itemsPerPage);
    } else {
      userList = await User.find(searchQuery).select("-password");
      totalItems = userList.length;
    }

    res.json({
      success: true,
      message: "User fetched",
      result: userList,
      total_pages: totalPages,
      total_items: totalItems,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    user.isVerified = !user.isVerified;
    await user.save();
    res.json({
      success: true,
      message: `User ${user.isVerified ? "verified" : "unverified"} updated successfully`,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error("Email is required");
    }
    const user = await User.findOne({ email: email });

    if (user?.otp && Date.now() < user?.otpExpiry) {
      throw new Error("OTP is already sent. Please check your mail");
    }
    const otp = Math.floor(Math.random() * 10000 + 90000);
    user.otp = otp.toString();
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    await emailHelper({
      templateName: "otpTemplate.html",
      receiverEmail: user.email,
      credentials: {
        name: user.name,
        otp: user.otp,
      },
    });
    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { otp, password } = req.body;
    if (!otp || !password) {
      throw new Error("Password and OTP are required");
    }

    const user = await User.findOne({ otp: otp });

    if (Date.now() > user.otpExpiry) {
      throw new Error("OTP expired");
    }
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.password = password;
    await user.save();
    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
