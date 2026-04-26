const joi = require("joi");

const registerSchema = joi.object({
  name: joi.string().max(100).optional().allow(""),
  username: joi.string().min(3).max(30).optional(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const loginSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().min(6).required(),
});

const budgetSchema = joi.object({
  monthlyIncome: joi.number().min(0).required(),
  categories: joi
    .array()
    .items(
      joi.object({
        name: joi.string().required(),
        percentage: joi.number().min(0).max(100).required(),
      })
    )
    .min(1)
    .required(),
});

const transactionSchema = joi.object({
  amount: joi.number().positive().required(),
  category: joi.string().required(),
  date: joi.date().required(),
  note: joi.string().allow("").optional(),
});

// Schema untuk update profile
const updateProfileSchema = joi.object({
  name: joi.string().max(100).optional().allow(""),
  username: joi.string().min(3).max(30).optional(),
});

// Schema untuk change password
const changePasswordSchema = joi.object({
  currentPassword: joi.string().min(6).required(),
  newPassword: joi.string().min(6).required(),
  confirmNewPassword: joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  budgetSchema,
  transactionSchema,
  updateProfileSchema,
  changePasswordSchema,
};
