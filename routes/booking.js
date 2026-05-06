const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const bookingController = require('../controllers/booking');
const { requireAuth } = require('../middleware/auth');

// GET /booking - Show booking form
router.get('/', requireAuth, bookingController.showBooking);

// POST /booking/confirm - Create booking in MongoDB
router.post('/confirm', requireAuth, bookingController.confirmBooking);

// GET /booking/confirmation
router.get('/confirmation', requireAuth, bookingController.bookingConfirmation);

module.exports = router;
