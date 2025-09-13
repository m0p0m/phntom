const Location = require('../models/Location');
const Device = require('../models/Device');

// @desc    Update a device's location (or create if it doesn't exist)
// @route   POST /api/location
// @access  Private
const updateLocation = async (req, res) => {
  // The device agent should send its persistent unique identifier
  const { uniqueIdentifier, latitude, longitude, timestamp } = req.body;

  if (uniqueIdentifier == null || latitude == null || longitude == null) {
    return res.status(400).json({ message: 'Please provide uniqueIdentifier, latitude, and longitude' });
  }

  try {
    const device = await Device.findOne({ uniqueIdentifier });
    if (!device) {
        return res.status(404).json({ message: 'Device not registered' });
    }

    const location = await Location.findOneAndUpdate(
      { device: device._id },
      {
        $set: {
          latitude,
          longitude,
          timestamp: timestamp || new Date(),
        },
      },
      {
        new: true,
        upsert: true,
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
