const Location = require('../models/Location');

// @desc    Update a device's location (or create if it doesn't exist)
// @route   POST /api/location
// @access  Private
const updateLocation = async (req, res) => {
  const { deviceId, latitude, longitude, timestamp } = req.body;

  if (deviceId == null || latitude == null || longitude == null) {
    return res.status(400).json({ message: 'Please provide deviceId, latitude, and longitude' });
  }

  try {
    const location = await Location.findOneAndUpdate(
      { deviceId: deviceId },
      {
        $set: {
          latitude,
          longitude,
          timestamp: timestamp || new Date(),
        },
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create a new document if one doesn't exist
        runValidators: true,
      }
    );
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get the latest location for a device
// @route   GET /api/location/:deviceId
// @access  Private
const getLatestLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ deviceId: req.params.deviceId });
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
