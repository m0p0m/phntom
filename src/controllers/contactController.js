const Contact = require('../models/Contact');

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
const Device = require('../models/Device');

const getContacts = async (req, res) => {
  // res.advancedResults is provided by the middleware
  res.status(200).json(res.advancedResults);
};

// @desc    Create a contact for a specific device
// @route   POST /api/devices/:deviceId/contacts
// @access  Private
const createContact = async (req, res) => {
  const { name, phoneNumber } = req.body;
  // deviceId is now from the URL params
  const deviceId = req.params.deviceId;

  if (!name || !phoneNumber) {
    return res.status(400).json({ message: 'Please provide name and phoneNumber' });
  }

  try {
    const device = await Device.findById(deviceId);
    if (!device) {
        return res.status(404).json({ message: 'Device not found' });
    }

    const contact = await Contact.create({
      name,
      phoneNumber,
      device: deviceId, // Use the actual ObjectId
    });

    res.status(201).json(contact);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: `A contact with phone number '${phoneNumber}' already exists for this device.` });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single contact
// @route   GET /api/contacts/:id
// @access  Private
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await contact.deleteOne(); // or findByIdAndRemove(req.params.id)

    res.status(200).json({ id: req.params.id, message: 'Contact removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
