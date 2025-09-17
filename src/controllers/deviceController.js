const Device = require('../models/Device');

// @desc    Get all registered devices
// @route   GET /api/devices
// @access  Private
const getDevices = async (req, res) => {
  try {
    const devices = await Device.find({});
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Register a new device
// @route   POST /api/devices/register
// @access  Private
const registerDevice = (io) => async (req, res) => {
  const { uniqueIdentifier, deviceName, platform, storage, ram } = req.body;

  try {
    let device = await Device.findOne({ uniqueIdentifier });
    if (device) {
      return res.status(400).json({ message: 'Device already registered' });
    }

    device = await Device.create({
      uniqueIdentifier,
      deviceName,
      platform,
      storage,
      ram,
      ipAddress: req.ip,
      lastSeen: new Date(),
    });

    // Emit event to all connected clients
    io.emit('device:registered', device);

    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ message: 'Error registering device', error: error.message });
  }
};

// @desc    Receive a heartbeat from a device
// @route   POST /api/devices/heartbeat
// @access  Private
const deviceHeartbeat = (io) => async (req, res) => {
  const { uniqueIdentifier, storage, ram } = req.body;

  if (!uniqueIdentifier) {
    return res.status(400).json({ message: 'uniqueIdentifier is required' });
  }

  try {
    const device = await Device.findOneAndUpdate(
      { uniqueIdentifier },
      {
        $set: {
          lastSeen: new Date(),
          ipAddress: req.ip,
          storage, // Update dynamic info
          ram,
        },
      },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: 'Device not found. Please register first.' });
    }

    // Emit event to all connected clients
    io.emit('device:status_update', device);

    res.status(200).json({ message: 'Heartbeat received' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getDevices,
  registerDevice,
  deviceHeartbeat,
};
