const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true, // Each device has only one location document
      index: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    timestamp: { // The time the location was recorded by the device
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Timestamps for when the record is created/updated in our DB
  }
);

module.exports = mongoose.model('Location', locationSchema);
