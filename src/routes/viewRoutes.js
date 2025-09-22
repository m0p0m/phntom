const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middlewares/authViewMiddleware');
const Device = require('../models/Device');

// @desc    Login/Landing page
// @route   GET /
router.get('/', (req, res) => {
    res.render('login', { title: 'Login' });
});

// @desc    Dashboard page
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const devices = await Device.find({}).lean();
        res.render('dashboard', {
            title: 'Dashboard',
            devices: devices
        });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

module.exports = router;
