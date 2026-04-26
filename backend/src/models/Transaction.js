const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
