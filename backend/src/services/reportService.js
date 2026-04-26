const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Wallet = require("../models/Wallet");

const getMonthlyReport = async (userId, month) => {
  const targetMonth = month || new Date().toISOString().slice(0, 7);

  const budget = await Budget.findOne({ userId, month: targetMonth });
  if (!budget) {
    throw new Error(`No budget found for ${targetMonth}`);
  }

  const startDate = new Date(targetMonth + "-01");
  const endDate = new Date(targetMonth + "-31");

  // Get all transactions for the month
  const transactions = await Transaction.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  });

  // Get wallets
  const wallets = await Wallet.find({ userId, month: targetMonth });

  // Calculate spending per category
  const spendingByCategory = {};
  transactions.forEach((t) => {
    spendingByCategory[t.category] =
      (spendingByCategory[t.category] || 0) + t.amount;
  });

  // Build report
  const categories = budget.categories.map((cat) => {
    const allocated = (budget.monthlyIncome * cat.percentage) / 100;
    const spent = spendingByCategory[cat.name] || 0;
    const remaining =
      wallets.find((w) => w.categoryName === cat.name)?.balance || 0;

    return {
      name: cat.name,
      percentage: cat.percentage,
      allocated,
      spent,
      remaining,
      usagePercentage: allocated > 0 ? (spent / allocated) * 100 : 0,
    };
  });

  return {
    month: targetMonth,
    totalIncome: budget.monthlyIncome,
    totalSpent: transactions.reduce((sum, t) => sum + t.amount, 0),
    totalRemaining: wallets.reduce((sum, w) => sum + w.balance, 0),
    categories,
  };
};

module.exports = { getMonthlyReport };
