/* booking.js — Multi-step booking form */

const data = window.BOOKING_DATA || { flightPrice: 0, passengersCount: 1 };
let currentStep = 0;
const totalSteps = 4;
let selectedSeats = [];
let bagCount = 0;

/* ===== STEP NAVIGATION ===== */
function goToStep(step) {
  // Hide all steps
  document.querySelectorAll('.step-content').forEach(el => el.classList.add('d-none'));
  document.getElementById(`step-${step}`)?.classList.remove('d-none');

  // Update circles
  for (let i = 0; i < totalSteps; i++) {
    const circle = document.getElementById(`stepCircle-${i}`);
    const label = document.getElementById(`stepLabel-${i}`);
    const icon = document.getElementById(`stepIcon-${i}`);
    if (!circle) continue;

    circle.classList.remove('active', 'done');
    label?.classList.remove('text-primary');
    label?.classList.add('text-muted');

    const icons = ['bi-person', 'bi-grid', 'bi-luggage', 'bi-credit-card'];

    if (i < step) {
      circle.classList.add('done');
      if (icon) { icon.className = 'bi bi-check-lg'; }
    } else if (i === step) {
      circle.classList.add('active');
      label?.classList.add('text-primary');
      label?.classList.remove('text-muted');
      if (icon) { icon.className = `bi ${icons[i]}`; }
    } else {
      if (icon) { icon.className = `bi ${icons[i]}`; }
    }

    // Step line
    const line = document.getElementById(`stepLine-${i}`);
    if (line) {
      line.classList.toggle('done', i < step);
    }
  }

  // Navigation buttons
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const confirmBtn = document.getElementById('confirmBtn');

  if (prevBtn) prevBtn.style.display = step > 0 ? '' : 'none';
  if (nextBtn) nextBtn.classList.toggle('d-none', step === totalSteps - 1);
  if (confirmBtn) confirmBtn.classList.toggle('d-none', step !== totalSteps - 1);

  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===== VALIDATION ===== */
function canProceed() {
  if (currentStep === 0) {
    const name = document.getElementById('passengerName')?.value.trim();
    const email = document.getElementById('passengerEmail')?.value.trim();
    return !!(name && email && email.includes('@'));
  }
  return true;
}

/* ===== SEAT MAP ===== */
function buildSeatMap() {
  const grid = document.getElementById('seatGrid');
  if (!grid) return;

  const rows = 20;
  const legsroomRows = [1, 12]; // Extra legroom rows
  const occupiedSeats = generateOccupied();

  let html = '';
  for (let row = 1; row <= rows; row++) {
    const isLegroom = legsroomRows.includes(row);
    html += `<div class="seat-row">`;
    ['A', 'B', 'C'].forEach(col => {
      const id = `${row}${col}`;
      const occupied = occupiedSeats.includes(id);
      const cls = occupied ? 'occupied' : isLegroom ? 'legroom available' : 'available';
      html += `<button type="button" class="seat-btn ${cls}" data-seat="${id}" ${occupied ? 'disabled' : ''}>${id}</button>`;
    });
    html += `<div class="seat-aisle"></div>`;
    ['D', 'E', 'F'].forEach(col => {
      const id = `${row}${col}`;
      const occupied = occupiedSeats.includes(id);
      const cls = occupied ? 'occupied' : isLegroom ? 'legroom available' : 'available';
      html += `<button type="button" class="seat-btn ${cls}" data-seat="${id}" ${occupied ? 'disabled' : ''}>${id}</button>`;
    });
    html += `</div>`;
    if (isLegroom) {
      html += `<div class="text-center text-warning small mb-1" style="font-size:10px">━ Extra Legroom ━</div>`;
    }
  }
  grid.innerHTML = html;

  grid.querySelectorAll('.seat-btn:not(.occupied)').forEach(btn => {
    btn.addEventListener('click', () => {
      const seat = btn.dataset.seat;
      if (selectedSeats.includes(seat)) {
        selectedSeats = selectedSeats.filter(s => s !== seat);
        btn.classList.remove('selected');
        btn.classList.add('available');
      } else {
        selectedSeats.push(seat);
        btn.classList.add('selected');
        btn.classList.remove('available');
      }
      const info = document.getElementById('seatSelectionInfo');
      if (info) info.textContent = selectedSeats.length ? `Selected: ${selectedSeats.join(', ')}` : 'No seat selected (optional)';
      document.getElementById('selectedSeatsInput').value = JSON.stringify(selectedSeats.map(s => ({ seat: s, flight: 'outbound' })));
    });
  });
}

function generateOccupied() {
  const seats = [];
  const cols = ['A','B','C','D','E','F'];
  for (let r = 1; r <= 20; r++) {
    cols.forEach(c => {
      if (Math.random() < 0.35) seats.push(`${r}${c}`);
    });
  }
  return seats;
}

/* ===== BAGGAGE ===== */
function setupBaggage() {
  const minus = document.getElementById('bagMinus');
  const plus = document.getElementById('bagPlus');
  const countEl = document.getElementById('bagCount');
  const input = document.getElementById('bagCountInput');

  if (!minus || !plus) return;

  plus.addEventListener('click', () => {
    if (bagCount < 3) {
      bagCount++;
      countEl.textContent = bagCount;
      input.value = bagCount;
      updateSummary();
    }
  });

  minus.addEventListener('click', () => {
    if (bagCount > 0) {
      bagCount--;
      countEl.textContent = bagCount;
      input.value = bagCount;
      updateSummary();
    }
  });
}

/* ===== PRICE SUMMARY ===== */
function updateSummary() {
  const extraLegroom = document.getElementById('extraLegroom')?.checked;
  const baggageExtra = bagCount * 45 + (extraLegroom ? 35 : 0);
  const base = data.flightPrice * data.passengersCount;
  const total = base + baggageExtra;
  const taxes = Math.round(total * 0.12);
  const grandTotal = total + taxes;

  const bagEl = document.getElementById('summaryBaggage');
  const taxEl = document.getElementById('summaryTax');
  const totalEl = document.getElementById('summaryTotal');

  if (bagEl) bagEl.textContent = `$${baggageExtra}`;
  if (taxEl) taxEl.textContent = `$${taxes}`;
  if (totalEl) totalEl.textContent = `$${grandTotal}`;
}

/* ===== PAYMENT TOGGLE ===== */
function setupPaymentMethods() {
  document.querySelectorAll('.payment-method-btn input').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.payment-opt').forEach(opt => opt.classList.remove('active'));
      radio.nextElementSibling?.classList.add('active');
      const cardDetails = document.getElementById('cardDetails');
      if (cardDetails) cardDetails.style.display = radio.value === 'card' ? '' : 'none';
    });
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  goToStep(0);
  buildSeatMap();
  setupBaggage();
  setupPaymentMethods();

  // Make updateSummary global
  window.updateSummary = updateSummary;

  document.getElementById('nextBtn')?.addEventListener('click', () => {
    if (!canProceed()) {
      // Highlight required fields
      ['passengerName', 'passengerEmail'].forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.value.trim()) {
          el.classList.add('is-invalid');
          el.addEventListener('input', () => el.classList.remove('is-invalid'), { once: true });
        }
      });
      return;
    }
    if (currentStep < totalSteps - 1) goToStep(currentStep + 1);
  });

  document.getElementById('prevBtn')?.addEventListener('click', () => {
    if (currentStep > 0) goToStep(currentStep - 1);
  });

  // Confirm loading state
  document.getElementById('bookingForm')?.addEventListener('submit', (e) => {
    const btn = document.getElementById('confirmBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Confirming...';
    }
  });
});
