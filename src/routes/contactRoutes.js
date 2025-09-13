const express = require('express');
const router = express.Router();
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');
const { protect } = require('../middlewares/authMiddleware');

// All these routes are protected
router.use(protect);

const Contact = require('../models/Contact');
const advancedResults = require('../middlewares/advancedResults');

router.route('/')
  .get(advancedResults(Contact), getContacts)
  .post(createContact);

router.route('/:id')
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;
