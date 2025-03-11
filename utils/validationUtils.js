// utils/validationUtils.js
const { body, query, validationResult } = require("express-validator");

const schoolValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("School name is required")
    .isLength({ max: 255 })
    .withMessage("School name must be less than 255 characters"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 255 })
    .withMessage("Address must be less than 255 characters"),

  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
];

const locationValidationRules = [
  query("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  query("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    errors: errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    })),
  });
};

module.exports = {
  schoolValidationRules,
  locationValidationRules,
  validate,
};
