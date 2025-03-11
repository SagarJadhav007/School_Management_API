// models/School.js
const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "School name is required"],
    trim: true,
    maxlength: [255, "School name must be less than 255 characters"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
    maxlength: [255, "Address must be less than 255 characters"],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create geospatial index for location-based queries
SchoolSchema.index({ location: "2dsphere" });

// Static method to calculate distance between two coordinates using Haversine formula
SchoolSchema.statics.calculateDistance = function (lat1, lon1, lat2, lon2) {
  // Convert latitude and longitude from degrees to radians
  const radLat1 = (Math.PI * lat1) / 180;
  const radLon1 = (Math.PI * lon1) / 180;
  const radLat2 = (Math.PI * lat2) / 180;
  const radLon2 = (Math.PI * lon2) / 180;

  // Haversine formula
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const dLat = radLat2 - radLat1;
  const dLon = radLon2 - radLon1;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance; // Returns distance in kilometers
};

module.exports = mongoose.model("School", SchoolSchema);
