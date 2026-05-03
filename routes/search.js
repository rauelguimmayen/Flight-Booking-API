const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const { tripType, cabinClass, passengers, outbound, returnDate } = req.query;

  let outboundData = {};
  let passengersData = { adults: 1, children: 0, infants: 0 };

  try { outboundData = JSON.parse(outbound || '{}'); } catch (e) {}
  try { passengersData = JSON.parse(passengers || '{}'); } catch (e) {}

  res.render('pages/search', {
    title: 'Search Results – SkyRoam',
    tripType: tripType || 'one-way',
    cabinClass: cabinClass || 'economy',
    passengers: passengersData,
    outbound: outboundData,
    returnDate: returnDate || '',
    query: req.query,
  });
});

module.exports = router;
