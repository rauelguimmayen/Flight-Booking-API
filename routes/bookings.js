const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const bookingsController = require('../controllers/bookings');
const { requireAuth } = require('../middleware/auth');


// GET /bookings - List all bookings
router.get('/', requireAuth, bookingsController.myBookings);


// POST /bookings/:id/cancel - Cancel a booking
router.post('/:id/cancel', requireAuth, bookingsController.cancelSpecificBooking);

module.exports = router;
