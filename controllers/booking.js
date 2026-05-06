const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');


module.exports.showBooking = (req, res) => {
  const { flight, tripType, cabinClass, passengers } = req.query;

  let flightData = {};
  let passengersData = { adults: 1, children: 0, infants: 0 };

  try { flightData = JSON.parse(flight || '{}'); } catch (e) {}
  try { passengersData = JSON.parse(passengers || '{}'); } catch (e) {}

  res.render('pages/booking', {
    title: 'Complete Booking – SkyRoam',
    flight: flightData,
    tripType: tripType || 'one-way',
    cabinClass: cabinClass || 'economy',
    passengers: passengersData,
  });
}

module.exports.confirmBooking = async (req, res) => {
  try {
    const {
      passenger_name, passenger_email, passenger_phone,
      flight, tripType, cabinClass, passengers,
      selected_seats, baggage_carry_on, baggage_checked_bags, baggage_extra_legroom,
      payment_method
    } = req.body;

    let flightData = {};
    let passengersData = { adults: 1, children: 0, infants: 0 };

    try { flightData = JSON.parse(flight || '{}'); } catch (e) {}
    try { passengersData = JSON.parse(passengers || '{}'); } catch (e) {}

    const checkedBags = parseInt(baggage_checked_bags || 0);
    const extraLegroom = baggage_extra_legroom === 'true';
    const passCount = (parseInt(passengersData.adults) || 1) +
                      (parseInt(passengersData.children) || 0) +
                      (parseInt(passengersData.infants) || 0);

    const baggageExtra = checkedBags * 45 + (extraLegroom ? 35 : 0);
    const basePrice = parseFloat(flightData.price) || 0;
    const totalPrice = basePrice * passCount + baggageExtra;
    const taxes = Math.round(totalPrice * 0.12);

    const ref = 'SR' + Date.now().toString(36).toUpperCase();

    // Parse seats
    let seatsArr = [];
    if (selected_seats) {
      try { seatsArr = JSON.parse(selected_seats); } catch(e) {}
    }

    const booking = new Booking({
      booking_reference: ref,
      status: 'confirmed',
      trip_type: tripType || 'one-way',
      passenger_name,
      passenger_email,
      passenger_phone,
      passengers_count: passCount,
      cabin_class: cabinClass || 'economy',
      outbound_flight: {
        flight_number: flightData.flightNumber,
        airline: flightData.airline,
        airline_code: flightData.airlineCode,
        origin_code: flightData.originCode,
        destination_code: flightData.destinationCode,
        departure_time: flightData.departureTime,
        arrival_time: flightData.arrivalTime,
        duration: flightData.duration,
        stops: flightData.stops || 0
      },
      selected_seats: seatsArr,
      baggage_options: {
        carry_on: baggage_carry_on !== 'false',
        checked_bags: checkedBags,
        extra_legroom: extraLegroom
      },
      total_price: totalPrice,
      base_price: basePrice,
      taxes,
      currency: 'USD',
      payment_method: payment_method || 'card'
    });

    await booking.save();

    res.redirect(`/booking/confirmation?ref=${ref}`);
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).render('pages/error', { title: 'Booking Error', error: err.message });
  }
};

module.exports.bookingConfirmation = async (req, res) => {
  const { ref } = req.query;
  let booking = null;
  if (ref) {
    booking = await Booking.findOne({ booking_reference: ref });
  }
  res.render('pages/confirmation', { title: 'Booking Confirmed – SkyRoam', ref, booking });
};