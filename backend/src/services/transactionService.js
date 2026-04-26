const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");

const addTransaction = async (userId, { amount, category, note, date }) => {
  const transactionDate = date ? new Date(date) : new Date();
  const month = transactionDate.toISOString().slice(0, 7);

  // Cari wallet untuk bulan yang sesuai
  const wallet = await Wallet.findOne({
    userId,
    categoryName: category,
    month: month,
  });

  if (!wallet) {
    throw new Error(`Category ${category} not found for this month`);
  }

  if (wallet.balance < amount) {
    throw new Error(
      `Insufficient funds in category ${category}. Remaining: ${wallet.balance}`
    );
  }

  // Kurangi balance wallet
  wallet.balance -= amount;
  await wallet.save();

  // Buat transaksi
  return await Transaction.create({
    userId,
    amount,
    category,
    note: note || "",
    date: transactionDate,
  });
};

const getTransactions = async (userId, query) => {
  const { startDate, endDate, category, limit = 50, page = 1 } = query;
  let filter = { userId };

  if (startDate) {
    filter.date = { ...filter.date, $gte: new Date(startDate) };
  }
  if (endDate) {
    filter.date = { ...filter.date, $lte: new Date(endDate) };
  }
  if (category && category !== "all") {
    filter.category = category;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Transaction.countDocuments(filter),
  ]);

  return {
    transactions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

module.exports = { addTransaction, getTransactions };
