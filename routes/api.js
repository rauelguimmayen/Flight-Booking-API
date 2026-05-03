const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

const AIRLINES = [
  { airline: 'Delta', airlineCode: 'DL', badge: 'best' },
  { airline: 'United', airlineCode: 'UA', badge: '' },
  { airline: 'American', airlineCode: 'AA', badge: '' },
  { airline: 'Emirates', airlineCode: 'EK', badge: 'fastest' },
  { airline: 'Lufthansa', airlineCode: 'LH', badge: '' },
  { airline: 'British Airways', airlineCode: 'BA', badge: '' },
];

// GET /api/flights - Generate mock flights
router.get('/flights', (req, res) => {
  const { origin, destination } = req.query;
  const flights = AIRLINES.map((a, i) => ({
    id: `${a.airlineCode}-${i}`,
    ...a,
    flightNumber: `${a.airlineCode}${Math.floor(Math.random() * 900 + 100)}`,
    originCode: origin || 'JFK',
    destinationCode: destination || 'LAX',
    departureTime: `${String(6 + i * 2).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
    arrivalTime: `${String(10 + i * 2).padStart(2, '0')}:${i % 2 === 0 ? '45' : '15'}`,
    duration: `${4 + i}h ${i * 15}m`,
    stops: i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2,
    price: Math.floor(180 + i * 85 + Math.random() * 100),
    wifi: i % 2 === 0,
    meals: i % 3 !== 0,
    baggage: i % 2 !== 0,
  }));
  res.json(flights);
});

// GET /api/bookings - List bookings (JSON)
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(50);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/cancel
router.patch('/bookings/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
