const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET /bookings - List all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(50);
    res.render('pages/bookings', { title: 'My Bookings – SkyRoam', bookings });
  } catch (err) {
    res.status(500).render('pages/error', { title: 'Error', error: err.message });
  }
});

// POST /bookings/:id/cancel - Cancel a booking
router.post('/:id/cancel', async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.redirect('/bookings');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
