const { getMonthlyReport } = require("../services/reportService");

const getReport = async (req, res) => {
  try {
    const { month } = req.query;
    const report = await getMonthlyReport(req.user._id, month);
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getReport };
