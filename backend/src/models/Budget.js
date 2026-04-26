const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    monthlyIncome: { type: Number, required: true, min: 0 },
    month: {
      type: String,
      required: true,
      default: () => new Date().toISOString().slice(0, 7),
    },
    categories: [
      {
        name: { type: String, required: true },
        percentage: { type: Number, required: true, min: 0, max: 100 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
