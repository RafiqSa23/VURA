const Budget = require("../models/Budget");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

// Setup budget untuk bulan tertentu
const setupBudget = async (userId, { monthlyIncome, categories, month }) => {
  // Validasi total persentase = 100%
  const totalPercentage = categories.reduce(
    (sum, cat) => sum + cat.percentage,
    0
  );
  if (totalPercentage !== 100) {
    throw new Error("Total percentage must equal 100%");
  }

  // Validasi month
  const targetMonth = month || new Date().toISOString().slice(0, 7);

  // Hapus budget dan wallet lama untuk bulan ini (jika ada)
  await Budget.findOneAndDelete({ userId, month: targetMonth });
  await Wallet.deleteMany({ userId, month: targetMonth });

  // Buat budget baru
  const budget = await Budget.create({
    userId,
    monthlyIncome,
    categories,
    month: targetMonth,
  });

  // Buat wallets untuk tiap kategori
  const wallets = categories.map((cat) => ({
    userId,
    categoryName: cat.name,
    balance: (cat.percentage / 100) * monthlyIncome,
    month: targetMonth,
    budgetId: budget._id,
  }));

  await Wallet.insertMany(wallets);

  return {
    budget,
    wallets: wallets.map((w) => ({
      category: w.categoryName,
      balance: w.balance,
    })),
  };
};

// Get budget summary berdasarkan bulan
const getBudgetSummary = async (userId, month) => {
  const targetMonth = month || new Date().toISOString().slice(0, 7);

  const budget = await Budget.findOne({ userId, month: targetMonth });
  if (!budget) {
    return null;
  }

  const wallets = await Wallet.find({ userId, month: targetMonth });

  // Hitung total pengeluaran bulan ini
  const startDate = new Date(targetMonth + "-01");
  const endDate = new Date(targetMonth + "-31");

  const totalSpentResult = await Transaction.aggregate([
    {
      $match: {
        userId,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalSpent = totalSpentResult[0]?.total || 0;
  const totalRemaining = wallets.reduce((sum, w) => sum + w.balance, 0);

  // Format response untuk dashboard
  const categories = budget.categories.map((cat) => {
    const wallet = wallets.find((w) => w.categoryName === cat.name);
    return {
      name: cat.name,
      percentage: cat.percentage,
      allocated: (budget.monthlyIncome * cat.percentage) / 100,
      remaining: wallet?.balance || 0,
      spent:
        (budget.monthlyIncome * cat.percentage) / 100 - (wallet?.balance || 0),
    };
  });

  return {
    monthlyIncome: budget.monthlyIncome,
    month: targetMonth,
    totalSpent,
    totalRemaining,
    categories,
  };
};

// Get daftar bulan yang sudah ada budgetnya
const getUserBudgetMonths = async (userId) => {
  const budgets = await Budget.find({ userId })
    .select("month")
    .sort({ month: -1 });
  return budgets.map((b) => b.month);
};

module.exports = { setupBudget, getBudgetSummary, getUserBudgetMonths };
