const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate field value entered",
      field: Object.keys(err.keyPattern)[0],
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ message: "Validation error", errors: messages });
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  res.status(500).json({ message: err.message || "Server Error" });
};

module.exports = errorHandler;
