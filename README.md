# ✈️ SkyRoam — Flight Booking App

A full-stack flight booking web app built with **Node.js / Express.js**, **MongoDB**, **Bootstrap 5**, and vanilla **JavaScript**.

---

## 📁 Project Structure

```
skyroam/
├── server.js               # Express server entry point
├── .env.example            # Environment variables template
├── models/
│   └── Booking.js          # Mongoose schema for bookings
├── routes/
│   ├── home.js             # GET /
│   ├── search.js           # GET /search
│   ├── booking.js          # GET /booking, POST /booking/confirm, GET /booking/confirmation
│   ├── bookings.js         # GET /bookings, POST /bookings/:id/cancel
│   ├── deals.js            # GET /deals
│   └── api.js              # GET /api/flights, GET|PATCH /api/bookings
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── navbar.ejs
│   │   ├── footer.ejs
│   │   ├── search_form.ejs
│   │   └── passenger_selector.ejs
│   └── pages/
│       ├── home.ejs
│       ├── search.ejs
│       ├── booking.ejs
│       ├── confirmation.ejs
│       ├── bookings.ejs
│       ├── deals.ejs
│       ├── 404.ejs
│       └── error.ejs
└── public/
    ├── css/styles.css
    └── js/
        ├── main.js         # Shared: airport autocomplete, search form, passenger selector
        ├── search.js       # Flight results: filtering, sorting, rendering
        ├── booking.js      # Multi-step form: steps, seat map, baggage, payment
        └── bookings.js     # My bookings: search, status filter, detail panel, cancel
```

---

## 🚀 Setup & Run

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`) OR a MongoDB Atlas connection string

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env and set your MONGODB_URI and SESSION_SECRET
```

### 4. Start the server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

### 5. Open in browser
```
http://localhost:3000
```

---

## 🌟 Features

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section with flight search form + popular destinations |
| Search Results | `/search` | Flight listings with filters (price, stops, airline) and sort |
| Booking | `/booking` | 4-step booking: Passengers → Seats → Extras → Payment |
| Confirmation | `/booking/confirmation` | Booking success with details |
| My Bookings | `/bookings` | List, search, filter, view details, cancel bookings |
| Deals | `/deals` | Curated flight deals with savings percentage |

### API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/flights` | Generate mock flight results |
| GET | `/api/bookings` | List all bookings (JSON) |
| PATCH | `/api/bookings/:id/cancel` | Cancel a booking |

---

## 🗄️ MongoDB Schema (Booking)

```
booking_reference  String (unique)
status             confirmed | pending | cancelled | completed
trip_type          one-way | round-trip | multi-city
passenger_name     String
passenger_email    String
passenger_phone    String
passengers_count   Number
cabin_class        economy | premium_economy | business | first
outbound_flight    { flight_number, airline, airline_code, origin_code, destination_code, ... }
selected_seats     [{ passenger, seat, flight }]
baggage_options    { carry_on, checked_bags, extra_legroom }
total_price        Number
base_price         Number
taxes              Number
currency           String
payment_method     String
```

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, EJS templating
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: Bootstrap 5, Bootstrap Icons, vanilla JavaScript
- **Session**: express-session + connect-mongo
- **Fonts**: Plus Jakarta Sans (Google Fonts)
