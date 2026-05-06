const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require("../models/Booking");


module.exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(50);
    res.render('pages/bookings', { title: 'My Bookings – SkyRoam', bookings });
  } catch (err) {
    res.status(500).render('pages/error', { title: 'Error', error: err.message });
  }
};

module.exports.cancelSpecificBooking = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.redirect('/bookings');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};