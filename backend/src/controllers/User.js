const bcryptjs = require("bcryptjs");
const generateToken = require("../utils/jwt");
const User = require("../models/User");

// Register user (tambah name dan username)
const registerUser = async (req, res) => {
  const { email, password, name, username } = req.body;

  // Cek email sudah terdaftar
  const existingEmail = await User.findOne({ email });
  if (existingEmail)
    return res.status(400).json({ message: "Email already registered" });

  // Cek username sudah terdaftar (jika diisi)
  if (username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ message: "Username already taken" });
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    name: name || "",
    username: username || null,
  });

  res.status(201).json({
    _id: user._id,
    email: user.email,
    name: user.name,
    username: user.username,
    token: generateToken(user._id),
  });
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Cek login dengan email atau username
  const user = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: email.toLowerCase() }],
  });

  if (user && (await bcryptjs.compare(password, user.password))) {
    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email/username or password" });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({
    success: true,
    data: user,
  });
};

// Update profile (name & username)
const updateProfile = async (req, res) => {
  const { name, username } = req.body;
  const userId = req.user._id;

  try {
    // Jika username diubah, cek ketersediaan
    if (username) {
      const existingUser = await User.findOne({
        username: username.toLowerCase(),
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (username !== undefined) updateData.username = username.toLowerCase();

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const userId = req.user._id;

  // Validasi
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({
      success: false,
      message: "New password and confirm password do not match",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  try {
    const user = await User.findById(userId);

    // Verifikasi password saat ini
    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash password baru
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
};
