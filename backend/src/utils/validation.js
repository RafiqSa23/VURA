const joi = require("joi");

const valiadate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) =>
      detail.message.replace(/"/g, "")
    );
    return res
      .status(400)
      .json({ errors: "validation failed", errors: messages });
  }
  next();
};

module.exports = valiadate;
