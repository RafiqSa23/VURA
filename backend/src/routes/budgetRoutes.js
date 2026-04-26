const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { setup, get, getMonths, check } = require("../controllers/Budget");
const validate = require("../utils/validation");
const { budgetSchema } = require("../utils/schemas");

router
  .route("/")
  .post(protect, validate(budgetSchema), setup)
  .get(protect, get);

router.get("/months", protect, getMonths);
router.get("/check", protect, check);

module.exports = router;
