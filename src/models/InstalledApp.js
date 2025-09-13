const mongoose = require('mongoose');

const installedAppSchema = new mongoose.Schema(
  {
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
      index: true,
    },
    appName: {
      type: String,
      required: [true, 'Please add an app name'],
      trim: true,
    },
    packageName: {
      type: String,
      required: [true, 'Please add a package name'],
    },
    version: {
      type: String,
    },
    installedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// A device should not have duplicate entries for the same package name.
installedAppSchema.index({ deviceId: 1, packageName: 1 }, { unique: true });

module.exports = mongoose.model('InstalledApp', installedAppSchema);
