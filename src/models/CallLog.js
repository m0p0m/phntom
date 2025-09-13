const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Please add a device ID'],
      index: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    type: {
      type: String,
      required: true,
      enum: ['INCOMING', 'OUTGOING', 'MISSED'],
    },
    duration: { // Duration in seconds
      type: Number,
      required: true,
      default: 0,
    },
    callDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CallLog', callLogSchema);
