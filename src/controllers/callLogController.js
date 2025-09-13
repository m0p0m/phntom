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
  req.body.device = req.params.deviceId;

  const device = await Device.findById(req.params.deviceId);
  if (!device) {
    return res.status(404).json({ message: 'Device not found' });
  }

  try {
    const log = await CallLog.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: 'Error adding call log', error: error.message });
  }
};

module.exports = {
  getCallLogs,
  addCallLog,
};
