/* bookings.js — My Bookings page */

const bookings = window.BOOKINGS_DATA || [];

const statusColors = {
  confirmed: 'success', pending: 'warning', cancelled: 'danger', completed: 'secondary'
};
const statusIcons = {
  confirmed: 'bi-check-circle-fill', pending: 'bi-clock-fill',
  cancelled: 'bi-x-circle-fill', completed: 'bi-check-circle'
};

/* ===== SEARCH FILTER ===== */
function setupSearch() {
  const input = document.getElementById('bookingSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    filterCards(q, getActiveStatus());
  });
}

/* ===== STATUS FILTER ===== */
function getActiveStatus() {
  return document.querySelector('.status-filter.active')?.dataset.status || 'all';
}

function setupStatusFilter() {
  document.querySelectorAll('.status-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.status-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const q = document.getElementById('bookingSearch')?.value.toLowerCase().trim() || '';
      filterCards(q, btn.dataset.status);
    });
  });
}

function filterCards(query, status) {
  document.querySelectorAll('.booking-card').forEach(card => {
    const matchQuery = !query ||
      card.dataset.ref?.includes(query) ||
      card.dataset.name?.includes(query) ||
      card.dataset.route?.toLowerCase().includes(query);
    const matchStatus = status === 'all' || card.dataset.status === status;
    card.style.display = matchQuery && matchStatus ? '' : 'none';
  });
}

/* ===== BOOKING DETAIL ===== */
window.showBookingDetail = function(id) {
  const booking = bookings.find(b => String(b._id) === String(id));
  if (!booking) return;

  const color = statusColors[booking.status] || 'secondary';
  const icon = statusIcons[booking.status] || 'bi-circle';
  const fl = booking.outbound_flight || {};
  const bag = booking.baggage_options || {};

  const html = `
    <!-- Status -->
    <div class="d-flex align-items-center gap-3 p-3 bg-${color} bg-opacity-10 text-${color} rounded-3 mb-4">
      <i class="bi ${icon} fs-5"></i>
      <div>
        <div class="fw-700 text-capitalize">${booking.status}</div>
        <div class="small opacity-75">Ref: <strong>${booking.booking_reference}</strong></div>
      </div>
    </div>

    <!-- Flight -->
    <div class="bg-white border rounded-3 p-3 mb-3">
      <h6 class="fw-700 mb-3 small text-muted text-uppercase">Flight Details</h6>
      <div class="d-flex align-items-center gap-3 mb-3">
        <div class="airline-badge-lg bg-primary text-white rounded-3 px-3 py-1 fw-800 small">${fl.airline_code || '??'}</div>
        <div>
          <div class="fw-700 small">${fl.airline || 'Unknown Airline'}</div>
          <div class="text-muted" style="font-size:11px">${fl.flight_number || ''}</div>
        </div>
      </div>
      <div class="d-flex align-items-center gap-3">
        <div class="text-center">
          <div class="fw-800 fs-5">${fl.departure_time || '--'}</div>
          <div class="text-muted small">${fl.origin_code || '---'}</div>
        </div>
        <div class="flex-grow-1 text-center">
          <div class="text-muted small">${fl.duration || ''}</div>
          <div class="d-flex align-items-center gap-1 my-1">
            <div class="flex-grow-1 border-top"></div>
            <i class="bi bi-airplane-fill text-primary small"></i>
            <div class="flex-grow-1 border-top"></div>
          </div>
          <div class="text-muted small">${fl.stops === 0 ? 'Non-stop' : (fl.stops || 0) + ' stop(s)'}</div>
        </div>
        <div class="text-center">
          <div class="fw-800 fs-5">${fl.arrival_time || '--'}</div>
          <div class="text-muted small">${fl.destination_code || '---'}</div>
        </div>
      </div>
    </div>

    <!-- Passenger -->
    <div class="bg-white border rounded-3 p-3 mb-3">
      <h6 class="fw-700 mb-3 small text-muted text-uppercase">Passenger</h6>
      <div class="row g-2 small">
        <div class="col-6"><span class="text-muted">Name</span><br><strong>${booking.passenger_name || 'N/A'}</strong></div>
        <div class="col-6"><span class="text-muted">Email</span><br><strong>${booking.passenger_email || 'N/A'}</strong></div>
        <div class="col-6"><span class="text-muted">Cabin</span><br><strong class="text-capitalize">${(booking.cabin_class || 'economy').replace('_', ' ')}</strong></div>
        <div class="col-6"><span class="text-muted">Passengers</span><br><strong>${booking.passengers_count || 1}</strong></div>
        ${booking.passenger_phone ? `<div class="col-6"><span class="text-muted">Phone</span><br><strong>${booking.passenger_phone}</strong></div>` : ''}
        <div class="col-6"><span class="text-muted">Trip Type</span><br><strong class="text-capitalize">${booking.trip_type || 'one-way'}</strong></div>
      </div>
    </div>

    <!-- Baggage -->
    <div class="bg-white border rounded-3 p-3 mb-3">
      <h6 class="fw-700 mb-3 small text-muted text-uppercase">Extras</h6>
      <div class="small d-flex flex-wrap gap-2">
        ${bag.carry_on !== false ? '<span class="badge bg-success bg-opacity-15 text-success border border-success border-opacity-25"><i class="bi bi-bag me-1"></i>Carry-on</span>' : ''}
        ${bag.checked_bags > 0 ? `<span class="badge bg-info bg-opacity-15 text-info border border-info border-opacity-25"><i class="bi bi-luggage me-1"></i>${bag.checked_bags} Checked bag${bag.checked_bags > 1 ? 's' : ''}</span>` : ''}
        ${bag.extra_legroom ? '<span class="badge bg-warning bg-opacity-15 text-warning border border-warning border-opacity-25"><i class="bi bi-arrows-expand-vertical me-1"></i>Extra Legroom</span>' : ''}
        ${!bag.carry_on && !bag.checked_bags && !bag.extra_legroom ? '<span class="text-muted">No extras selected</span>' : ''}
      </div>
    </div>

    <!-- Seats -->
    ${booking.selected_seats?.length ? `
    <div class="bg-white border rounded-3 p-3 mb-3">
      <h6 class="fw-700 mb-2 small text-muted text-uppercase">Seats</h6>
      <div class="d-flex flex-wrap gap-1">
        ${booking.selected_seats.map(s => `<span class="badge bg-primary">${s.seat}</span>`).join('')}
      </div>
    </div>` : ''}

    <!-- Pricing -->
    <div class="bg-white border rounded-3 p-3 mb-4">
      <h6 class="fw-700 mb-3 small text-muted text-uppercase">Pricing</h6>
      <div class="small">
        ${booking.base_price ? `<div class="d-flex justify-content-between mb-1"><span class="text-muted">Base fare</span><span>$${booking.base_price}</span></div>` : ''}
        ${booking.taxes ? `<div class="d-flex justify-content-between mb-1"><span class="text-muted">Taxes</span><span>$${booking.taxes}</span></div>` : ''}
        <hr class="my-2" />
        <div class="d-flex justify-content-between fw-800 text-primary">
          <span>Total Paid</span><span>$${booking.total_price}</span>
        </div>
      </div>
    </div>

    ${booking.status === 'confirmed' ? `
    <button class="btn btn-danger w-100 rounded-3 fw-700"
      onclick="cancelBooking('${booking._id}')">
      <i class="bi bi-x-circle me-2"></i>Cancel Booking
    </button>` : ''}
  `;

  document.getElementById('bookingDetailBody').innerHTML = html;

  const offcanvas = new bootstrap.Offcanvas(document.getElementById('bookingDetailOffcanvas'));
  offcanvas.show();
};

/* ===== CANCEL BOOKING ===== */
window.cancelBooking = async function(id) {
  if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

  try {
    const res = await fetch(`/api/bookings/${id}/cancel`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Cancel failed');

    // Update DOM
    const card = document.querySelector(`.booking-card[onclick*="${id}"]`);
    if (card) {
      card.dataset.status = 'cancelled';
      const statusBadge = card.querySelector('.badge');
      if (statusBadge) {
        statusBadge.className = 'badge bg-danger bg-opacity-15 text-danger border border-danger border-opacity-25 rounded-pill';
        statusBadge.innerHTML = '<i class="bi bi-x-circle-fill me-1"></i>Cancelled';
      }
    }

    // Close offcanvas
    bootstrap.Offcanvas.getInstance(document.getElementById('bookingDetailOffcanvas'))?.hide();

    // Show toast
    showToast('Booking cancelled successfully.', 'danger');
  } catch (err) {
    alert('Failed to cancel booking. Please try again.');
  }
};

/* ===== SIMPLE TOAST ===== */
function showToast(message, type = 'success') {
  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3`;
  toastEl.setAttribute('role', 'alert');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body fw-600">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  document.body.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
  toast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  setupSearch();
  setupStatusFilter();
});
