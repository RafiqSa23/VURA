const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryName: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    month: {
      type: String,
      required: true,
      default: () => new Date().toISOString().slice(0, 7),
    },
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      required: true,
    },
  },
  { timestamps: true }
);

walletSchema.index({ userId: 1, categoryName: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Wallet", walletSchema);
