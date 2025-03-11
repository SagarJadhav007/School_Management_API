// routes/schoolRoutes.js
const express = require("express");
const router = express.Router();
const { addSchool, listSchools } = require("../controllers/schoolController");
const {
  schoolValidationRules,
  locationValidationRules,
  validate,
} = require("../utils/validationUtils");

// Add school route
router.post("/addSchool", schoolValidationRules, validate, addSchool);

// List schools route
router.get("/listSchools", locationValidationRules, validate, listSchools);

module.exports = router;
