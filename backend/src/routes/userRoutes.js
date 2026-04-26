const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/User");
const { protect } = require("../middleware/auth");
const validate = require("../utils/validation");
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} = require("../utils/schemas");

// Public routes
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);

// Protected routes (require login)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, validate(updateProfileSchema), updateProfile);
router.put(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePassword
);

module.exports = router;
