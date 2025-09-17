const Location = require('../models/Location');
const Device = require('../models/Device');

// @desc    Update a device's location
// @route   POST /api/devices/:deviceId/location
// @access  Private
const updateLocation = async (req, res) => {
  const { latitude, longitude, timestamp } = req.body;
  const { deviceId } = req.params;

  if (latitude == null || longitude == null) {
    return res.status(400).json({ message: 'Please provide latitude and longitude' });
  }

  try {
    // Device existence is already checked by the time we get here if this is a protected route
    // that verifies device ownership, but a direct check is safer.
    const device = await Device.findById(deviceId);
     if (!device) {
        return res.status(404).json({ message: 'Device not found' });
    }

    const location = await Location.findOneAndUpdate(
      { device: deviceId },
      {
        $set: {
          latitude,
          longitude,
          timestamp: timestamp || new Date(),
        },
      },
      {
        new: true,
        upsert: true, // Create a location doc if one doesn't exist
        runValidators: true,
      }
    );
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get the latest location for a device
// @route   GET /api/devices/:deviceId/location
// @access  Private
const getLatestLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ device: req.params.deviceId });
    if (!location) {
      return res.status(404).json({ message: 'Location not found for this device' });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  updateLocation,
  getLatestLocation,
};
