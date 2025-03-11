// controllers/schoolController.js
const School = require("../models/School");

const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Convert latitude and longitude to numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Create new school
    const schoolId = await School.create(name, address, lat, lng);

    return res.status(201).json({
      success: true,
      message: "School added successfully",
      data: {
        id: schoolId,
        name,
        address,
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

    // Get all schools sorted by proximity
    const schools = await School.findAllSortedByProximity(userLat, userLng);

    // Format the response with distance
    const formattedSchools = schools.map((school) => ({
      id: school.id,
      name: school.name,
      address: school.address,
      latitude: school.latitude,
      longitude: school.longitude,
      distance: parseFloat(school.distance.toFixed(2)), // Round to 2 decimal places
    }));

    return res.status(200).json({
      success: true,
      count: formattedSchools.length,
      data: formattedSchools,
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
