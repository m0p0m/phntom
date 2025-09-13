const CallLog = require('../models/CallLog');

// @desc    Get all call logs for a device
// @route   GET /api/call-logs/:deviceId
// @access  Private
const getCallLogs = async (req, res) => {
  try {
    const logs = await CallLog.find({ deviceId: req.params.deviceId }).sort({ callDate: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add a call log
// @route   POST /api/call-logs
// @access  Private
const addCallLog = async (req, res) => {
  const { deviceId, phoneNumber, type, duration, callDate } = req.body;

  if (!deviceId || !phoneNumber || !type || !callDate) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const log = await CallLog.create({
      deviceId,
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
