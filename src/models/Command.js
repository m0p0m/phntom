const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema(
  {
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify a command type'],
      // Example types, can be expanded
      enum: ['RING', 'SHOW_MESSAGE', 'WIPE_DATA'],
    },
    payload: { // Optional data for the command
      type: Object,
    },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'SENT', 'EXECUTED', 'FAILED'],
      default: 'PENDING',
    },
    executedAt: { // Time the device reported execution
      type: Date,
    },
    errorMessage: { // If the command failed
        type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Command', commandSchema);
