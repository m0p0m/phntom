const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getContacts,
  createContact,
} = require('../controllers/contactController');
const { protect } = require('../middlewares/authMiddleware');
const advancedResults = require('../middlewares/advancedResults');
const Contact = require('../models/Contact');

router.use(protect);

router.route('/')
  .get(advancedResults(Contact, { path: 'device', select: 'deviceName platform' }), getContacts)
  .post(createContact);

module.exports = router;
