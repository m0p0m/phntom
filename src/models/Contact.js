const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    // In a multi-user system, you would link this to a user ID
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'User',
    // },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a contact name'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add a phone number'],
      unique: true, // A phone number should be unique per device/user context
    },
  },
  {
    timestamps: true,
  }
);

// To make the unique constraint work per device, you'd create a compound index.
// For example: contactSchema.index({ deviceId: 1, phoneNumber: 1 }, { unique: true });
// I will add this for robustness.

contactSchema.index({ deviceId: 1, phoneNumber: 1 }, { unique: true });


module.exports = mongoose.model('Contact', contactSchema);
