// models/School.js
const { pool } = require("../config/database");

class School {
  static async create(name, address, latitude, longitude) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
        [name, address, latitude, longitude]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error creating school:", error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await pool.execute("SELECT * FROM schools");
      return rows;
    } catch (error) {
      console.error("Error finding schools:", error);
      throw error;
    }
  }

  // Calculate distance between two coordinates using Haversine formula
  static calculateDistance(lat1, lon1, lat2, lon2) {
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
  }

  static async findAllSortedByProximity(userLat, userLon) {
    try {
      const schools = await this.findAll();

      // Calculate distance for each school and add it as a property
      schools.forEach((school) => {
        school.distance = this.calculateDistance(
          userLat,
          userLon,
          school.latitude,
          school.longitude
        );
      });

      // Sort schools by distance (nearest first)
      return schools.sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error("Error finding schools sorted by proximity:", error);
      throw error;
    }
  }
}

module.exports = School;
