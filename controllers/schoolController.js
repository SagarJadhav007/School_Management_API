// controllers/schoolController.js
const School = require("../models/School");

const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Convert latitude and longitude to numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Create new school
    const school = await School.create({
      name,
      address,
      location: {
        type: "Point",
        coordinates: [lng, lat], // MongoDB uses [longitude, latitude] format
      },
    });

    return res.status(201).json({
      success: true,
      message: "School added successfully",
      data: {
        id: school._id,
        name: school.name,
        address: school.address,
        latitude: lat,
        longitude: lng,
      },
    });
  } catch (error) {
    console.error("Error in addSchool controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Convert latitude and longitude to numbers
    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    // Find all schools
    const schools = await School.find();

    // Calculate distance for each school and sort
    const schoolsWithDistance = schools.map((school) => {
      // Extract latitude and longitude from the location field
      const [schoolLng, schoolLat] = school.location.coordinates;

      // Calculate distance using the Haversine formula
      const distance = School.calculateDistance(
        userLat,
        userLng,
        schoolLat,
        schoolLng
      );

      // Return a formatted object with distance
      return {
        id: school._id,
        name: school.name,
        address: school.address,
        latitude: schoolLat,
        longitude: schoolLng,
        distance: parseFloat(distance.toFixed(2)), // Round to 2 decimal places
      };
    });

    // Sort by distance (nearest first)
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    return res.status(200).json({
      success: true,
      count: schoolsWithDistance.length,
      data: schoolsWithDistance,
    });
  } catch (error) {
    console.error("Error in listSchools controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  addSchool,
  listSchools,
};
