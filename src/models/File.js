const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Please add a device ID'],
      index: true,
    },
    fileName: {
      type: String,
      required: [true, 'Please add a file name'],
      trim: true,
    },
    filePath: { // The original path on the device
      type: String,
      required: [true, 'Please add the file path'],
    },
    fileType: { // e.g., 'image/jpeg', 'application/pdf'
      type: String,
      required: true,
    },
    size: { // Size in bytes
      type: Number,
      required: true,
    },
    storageUrl: { // URL to the file in a cloud storage (e.g., S3)
      type: String,
      required: [true, 'Please provide the storage URL'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate file entries for the same path on a device
fileSchema.index({ deviceId: 1, filePath: 1 }, { unique: true });

module.exports = mongoose.model('File', fileSchema);
