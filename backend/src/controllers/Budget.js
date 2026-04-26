const {
  setupBudget,
  getBudgetSummary,
  getUserBudgetMonths,
} = require("../services/budgetService");

const Budget = require("../models/Budget");

const setup = async (req, res) => {
  try {
    const { monthlyIncome, categories, month } = req.body;

    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Month is required",
      });
    }

    const budget = await setupBudget(req.user._id, {
      monthlyIncome,
      categories,
      month,
    });

    res.status(201).json({
      success: true,
      message: "Budget setup successful",
      data: budget,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const get = async (req, res) => {
  try {
    const { month } = req.query;
    const summary = await getBudgetSummary(req.user._id, month);

    if (!summary) {
      return res.status(404).json({
        success: false,
        message:
          "No budget found for this month. Please setup your budget first.",
      });
    }

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMonths = async (req, res) => {
  try {
    const months = await getUserBudgetMonths(req.user._id);
    res.json({
      success: true,
      data: months,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const check = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const budget = await Budget.findOne({
      userId: req.user._id,
      month: currentMonth,
    });

    res.json({
      success: true,
      hasSetup: !!budget,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { setup, get, getMonths, check };
