const express = require('express');
const router = express.Router();
const {
  getContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/:id')
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;
