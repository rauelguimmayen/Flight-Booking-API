const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flight_number: String,
  airline: String,
  airline_code: String,
  origin: String,
  origin_code: String,
  destination: String,
  destination_code: String,
  departure_time: String,
  arrival_time: String,
  duration: String,
  stops: { type: Number, default: 0 }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  booking_reference: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  trip_type: {
    type: String,
    enum: ['one-way', 'round-trip', 'multi-city'],
    default: 'one-way'
  },
  passenger_name: { type: String, required: true },
  passenger_email: { type: String, required: true },
  passenger_phone: String,
  passengers_count: { type: Number, default: 1 },
  cabin_class: {
    type: String,
    enum: ['economy', 'premium_economy', 'business', 'first'],
    default: 'economy'
  },
  outbound_flight: { type: flightSchema, required: true },
  return_flight: flightSchema,
  selected_seats: [{
    passenger: String,
    seat: String,
    flight: String
  }],
  baggage_options: {
    carry_on: { type: Boolean, default: true },
    checked_bags: { type: Number, default: 0 },
    extra_legroom: { type: Boolean, default: false }
  },
  total_price: { type: Number, required: true },
  base_price: Number,
  taxes: Number,
  currency: { type: String, default: 'USD' },
  payment_method: { type: String, default: 'card' },
  check_in_status: {
    type: String,
    enum: ['not_available', 'open', 'completed'],
    default: 'not_available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
