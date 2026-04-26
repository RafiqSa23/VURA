const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { create, list } = require("../controllers/Transaction");
const validate = require("../utils/validation");
const { transactionSchema } = require("../utils/schemas");

router.post("/", protect, validate(transactionSchema), create);
router.get("/", protect, list);

module.exports = router;
