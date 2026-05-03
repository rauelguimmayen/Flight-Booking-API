/* search.js — Flight search results page */

let allFlights = [];
let currentSort = 'best';
let maxPrice = 2000;
let stopFilters = [];
let airlineFilters = [];

const params = window.SEARCH_PARAMS || {};

/* ===== FETCH FLIGHTS ===== */
async function loadFlights() {
  try {
    const url = `/api/flights?origin=${encodeURIComponent(params.origin || 'JFK')}&destination=${encodeURIComponent(params.destination || 'LAX')}`;
    const res = await fetch(url);
    allFlights = await res.json();

    // Build airline checkboxes
    buildAirlineFilters();

    document.getElementById('loadingSkeleton').classList.add('d-none');
    document.getElementById('flightsList').classList.remove('d-none');

    renderFlights();
  } catch (err) {
    console.error('Error loading flights:', err);
    document.getElementById('loadingSkeleton').innerHTML = `
      <div class="alert alert-danger rounded-4">
        <i class="bi bi-exclamation-triangle me-2"></i>Failed to load flights. Please try again.
      </div>`;
  }
}

/* ===== BUILD AIRLINE FILTER CHECKBOXES ===== */
function buildAirlineFilters() {
  const airlines = [...new Set(allFlights.map(f => f.airline))];
  const container = document.getElementById('airlineFilters');
  if (!container) return;

  container.innerHTML = airlines.map(a => `
    <div class="form-check">
      <input class="form-check-input airline-filter" type="checkbox" value="${a}" id="airline-${a}">
      <label class="form-check-label small" for="airline-${a}">${a}</label>
    </div>
  `).join('');

  container.querySelectorAll('.airline-filter').forEach(cb => {
    cb.addEventListener('change', () => {
      airlineFilters = [...document.querySelectorAll('.airline-filter:checked')].map(c => c.value);
      renderFlights();
    });
  });
}

/* ===== FILTER & SORT ===== */
function getFilteredFlights() {
  let flights = [...allFlights];

  // Price
  flights = flights.filter(f => f.price <= maxPrice);

  // Stops
  if (stopFilters.length > 0) {
    flights = flights.filter(f => {
      if (stopFilters.includes('nonstop') && f.stops === 0) return true;
      if (stopFilters.includes('1stop') && f.stops <= 1) return true;
      if (stopFilters.includes('any') && f.stops >= 2) return true;
      return false;
    });
  }

  // Airlines
  if (airlineFilters.length > 0) {
    flights = flights.filter(f => airlineFilters.includes(f.airline));
  }

  // Sort
  if (currentSort === 'price') {
    flights.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'duration') {
    flights.sort((a, b) => {
      const [ah, am] = a.duration.match(/\d+/g).map(Number);
      const [bh, bm] = b.duration.match(/\d+/g).map(Number);
      return (ah * 60 + am) - (bh * 60 + bm);
    });
  } else {
    // best — badge first
    flights.sort((a, b) => {
      if (a.badge === 'best') return -1;
      if (b.badge === 'best') return 1;
      return a.price - b.price;
    });
  }

  return flights;
}

/* ===== RENDER FLIGHTS ===== */
function renderFlights() {
  const flights = getFilteredFlights();
  const container = document.getElementById('flightsList');
  const countEl = document.getElementById('resultsCount');
  if (countEl) countEl.textContent = `${flights.length} flight${flights.length !== 1 ? 's' : ''} found`;

  if (!flights.length) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-search text-muted" style="font-size:3rem;opacity:0.3"></i>
        <h5 class="fw-700 mt-3">No flights match your filters</h5>
        <p class="text-muted">Try adjusting your filter settings</p>
      </div>`;
    return;
  }

  container.innerHTML = flights.map((f, i) => renderFlightCard(f, i)).join('');

  container.querySelectorAll('.select-flight-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const flightData = JSON.parse(btn.dataset.flight);
      const bookingParams = new URLSearchParams({
        flight: JSON.stringify(flightData),
        tripType: params.tripType || 'one-way',
        cabinClass: params.cabinClass || 'economy',
        adults: params.passengers?.adults || 1,
        children: params.passengers?.children || 0,
        infants: params.passengers?.infants || 0,
        passengers: JSON.stringify(params.passengers || { adults: 1, children: 0, infants: 0 })
      });
      window.location.href = `/booking?${bookingParams.toString()}`;
    });
  });
}

function renderFlightCard(f, i) {
  const stopsLabel = f.stops === 0 ? '<span class="text-success fw-700">Non-stop</span>' :
    `<span class="text-warning fw-700">${f.stops} stop${f.stops > 1 ? 's' : ''}</span>`;

  const badge = f.badge === 'best'
    ? '<span class="badge badge-best rounded-pill px-2 ms-2">BEST</span>'
    : f.badge === 'fastest'
    ? '<span class="badge badge-fastest rounded-pill px-2 ms-2">FASTEST</span>'
    : '';

  const amenities = [
    f.wifi ? '<span class="amenity-icon active" title="Wi-Fi"><i class="bi bi-wifi"></i> Wi-Fi</span>' : '<span class="amenity-icon" title="No Wi-Fi"><i class="bi bi-wifi-off"></i></span>',
    f.meals ? '<span class="amenity-icon active" title="Meals"><i class="bi bi-cup-hot"></i> Meal</span>' : '',
    f.baggage ? '<span class="amenity-icon active" title="Baggage"><i class="bi bi-luggage"></i> Bag</span>' : '',
  ].filter(Boolean).join(' ');

  return `
    <div class="flight-card p-4 mb-3 fade-in-up" style="animation-delay:${i * 0.05}s">
      <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
        <!-- Airline -->
        <div class="d-flex align-items-center gap-3 flex-shrink-0" style="min-width:160px">
          <div class="airline-logo-box">${f.airlineCode}</div>
          <div>
            <div class="fw-700 small">${f.airline}${badge}</div>
            <div class="text-muted" style="font-size:11px">${f.flightNumber}</div>
          </div>
        </div>

        <!-- Route -->
        <div class="flex-grow-1 d-flex align-items-center gap-3">
          <div class="text-center">
            <div class="fw-800 fs-5">${f.departureTime}</div>
            <div class="text-muted small fw-600">${f.originCode}</div>
          </div>
          <div class="flight-route-line flex-grow-1">
            <div class="route-line"></div>
            <div class="text-center">
              <div class="text-muted" style="font-size:11px">${f.duration}</div>
              <i class="bi bi-airplane-fill text-primary small"></i>
              <div style="font-size:11px">${stopsLabel}</div>
            </div>
            <div class="route-line"></div>
          </div>
          <div class="text-center">
            <div class="fw-800 fs-5">${f.arrivalTime}</div>
            <div class="text-muted small fw-600">${f.destinationCode}</div>
          </div>
        </div>

        <!-- Amenities + Price -->
        <div class="d-flex flex-row flex-md-column align-items-center align-items-md-end gap-3 ms-md-auto">
          <div class="d-none d-md-flex gap-2 small">${amenities}</div>
          <div class="text-end">
            <div class="fw-800 fs-4 text-primary">$${f.price}</div>
            <div class="text-muted" style="font-size:11px">per person</div>
          </div>
          <button class="btn btn-primary rounded-3 px-4 py-2 fw-700 select-flight-btn"
            data-flight='${JSON.stringify(f)}'>
            Select
          </button>
        </div>
      </div>
    </div>`;
}

/* ===== PRICE FILTER ===== */
function setupPriceFilter() {
  ['priceFilter', 'priceFilterMobile'].forEach(id => {
    const el = document.getElementById(id);
    const valEl = document.getElementById(id === 'priceFilter' ? 'priceVal' : 'priceValMobile');
    if (!el) return;
    el.addEventListener('input', () => {
      maxPrice = parseInt(el.value);
      if (valEl) valEl.textContent = `$${maxPrice}`;
      // Sync both sliders
      if (id === 'priceFilter') {
        const mob = document.getElementById('priceFilterMobile');
        if (mob) mob.value = maxPrice;
      } else {
        const des = document.getElementById('priceFilter');
        if (des) des.value = maxPrice;
      }
      renderFlights();
    });
  });
}

/* ===== STOP FILTER ===== */
function setupStopFilters() {
  document.querySelectorAll('.stop-filter').forEach(cb => {
    cb.addEventListener('change', () => {
      stopFilters = [...document.querySelectorAll('.stop-filter:checked')].map(c => c.value);
      renderFlights();
    });
  });
}

/* ===== SORT BUTTONS ===== */
function setupSortButtons() {
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.dataset.sort;
      renderFlights();
    });
  });
}

/* ===== RESET FILTERS ===== */
function setupResetFilters() {
  const btn = document.getElementById('resetFilters');
  if (!btn) return;
  btn.addEventListener('click', () => {
    maxPrice = 2000;
    stopFilters = [];
    airlineFilters = [];
    document.querySelectorAll('.stop-filter, .airline-filter').forEach(cb => cb.checked = false);
    const pf = document.getElementById('priceFilter');
    const pv = document.getElementById('priceVal');
    if (pf) pf.value = 2000;
    if (pv) pv.textContent = '$2000';
    renderFlights();
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  setupPriceFilter();
  setupStopFilters();
  setupSortButtons();
  setupResetFilters();
  loadFlights();
});
