const CallLog = require('../models/CallLog');

const Device = require('../models/Device');

// @desc    Get all call logs for a device
// @route   GET /api/devices/:deviceId/call-logs
// @access  Private
const getCallLogs = async (req, res) => {
  res.status(200).json(res.advancedResults);
};

// @desc    Add a call log for a specific device
// @route   POST /api/devices/:deviceId/call-logs
// @access  Private
const addCallLog = async (req, res) => {
  const { phoneNumber, type, duration, callDate } = req.body;
  const { deviceId } = req.params;

  if (!phoneNumber || !type || !callDate) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const device = await Device.findById(deviceId);
    if (!device) {
        return res.status(404).json({ message: 'Device not found' });
    }

    const log = await CallLog.create({
      device: deviceId,
      phoneNumber,
      type,
      duration,
      callDate,
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getCallLogs,
  addCallLog,
};
