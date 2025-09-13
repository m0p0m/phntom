const Command = require('../models/Command');
const Device = require('../models/Device');

// @desc    Queue a new command for a device
// @route   POST /api/devices/:deviceId/commands
// @access  Private (Admin)
const queueCommand = async (req, res) => {
  const { type, payload } = req.body;
  const { deviceId } = req.params;

  try {
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const command = await Command.create({
      device: deviceId,
      type,
      payload,
      status: 'PENDING',
    });
    res.status(201).json(command);
  } catch (error) {
    res.status(400).json({ message: 'Error queueing command', error: error.message });
  }
};

// @desc    Device fetches its pending commands
// @route   GET /api/devices/:deviceId/commands/pending
// @access  Private (Device - could be a different auth mechanism in reality)
const getPendingCommands = async (req, res) => {
  try {
    const commands = await Command.find({
      device: req.params.deviceId,
      status: 'PENDING',
    }).sort('createdAt');

    res.status(200).json(commands);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Device updates the status of a command
// @route   PUT /api/commands/:commandId
// @access  Private (Device)
const updateCommandStatus = async (req, res) => {
  const { status, errorMessage } = req.body;
  const { commandId } = req.params;

  if (!status) {
    return res.status(400).json({ message: 'Please provide a status' });
  }

  try {
    const command = await Command.findById(commandId);
    if (!command) {
      return res.status(404).json({ message: 'Command not found' });
    }

    command.status = status;
    command.executedAt = new Date();
    if (errorMessage) {
      command.errorMessage = errorMessage;
    }

    await command.save();
    res.status(200).json(command);
  } catch (error) {
    res.status(400).json({ message: 'Error updating command status', error: error.message });
  }
};

module.exports = {
  queueCommand,
  getPendingCommands,
  updateCommandStatus,
};
