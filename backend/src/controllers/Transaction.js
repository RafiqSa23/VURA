const {
  addTransaction,
  getTransactions,
} = require("../services/transactionService");

const create = async (req, res) => {
  try {
    const transaction = await addTransaction(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      data: transaction,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const list = async (req, res) => {
  try {
    const transactions = await getTransactions(req.user._id, req.query);
    res.json({
      success: true,
      data: transactions,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { create, list };
