/* ===== AIRPORTS DATA ===== */
const AIRPORTS = [
  { code: 'JFK', name: 'John F. Kennedy Intl', city: 'New York', country: 'USA' },
  { code: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'USA' },
  { code: 'ORD', name: "O'Hare Intl", city: 'Chicago', country: 'USA' },
  { code: 'ATL', name: 'Hartsfield-Jackson', city: 'Atlanta', country: 'USA' },
  { code: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', country: 'USA' },
  { code: 'MIA', name: 'Miami Intl', city: 'Miami', country: 'USA' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
  { code: 'DXB', name: 'Dubai Intl', city: 'Dubai', country: 'UAE' },
  { code: 'NRT', name: 'Narita Intl', city: 'Tokyo', country: 'Japan' },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia' },
  { code: 'DPS', name: 'Ngurah Rai Intl', city: 'Bali', country: 'Indonesia' },
  { code: 'BCN', name: 'Barcelona-El Prat', city: 'Barcelona', country: 'Spain' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'ICN', name: 'Incheon Intl', city: 'Seoul', country: 'South Korea' },
  { code: 'HKG', name: 'Hong Kong Intl', city: 'Hong Kong', country: 'China' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'MNL', name: 'Ninoy Aquino Intl', city: 'Manila', country: 'Philippines' },
  { code: 'CGK', name: 'Soekarno-Hatta Intl', city: 'Jakarta', country: 'Indonesia' },
  { code: 'KUL', name: 'Kuala Lumpur Intl', city: 'Kuala Lumpur', country: 'Malaysia' },
  { code: 'DOH', name: 'Hamad Intl', city: 'Doha', country: 'Qatar' },
  { code: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canada' },
  { code: 'MEX', name: 'Benito Juárez Intl', city: 'Mexico City', country: 'Mexico' },
  { code: 'GRU', name: 'São Paulo-Guarulhos', city: 'São Paulo', country: 'Brazil' },
  { code: 'JNB', name: 'O.R. Tambo Intl', city: 'Johannesburg', country: 'South Africa' },
  { code: 'CAI', name: 'Cairo Intl', city: 'Cairo', country: 'Egypt' },
  { code: 'DEL', name: 'Indira Gandhi Intl', city: 'New Delhi', country: 'India' },
  { code: 'BOM', name: 'Chhatrapati Shivaji', city: 'Mumbai', country: 'India' },
  { code: 'PEK', name: 'Capital Intl', city: 'Beijing', country: 'China' },
  { code: 'PVG', name: 'Pudong Intl', city: 'Shanghai', country: 'China' },
  { code: 'VIE', name: 'Vienna Intl', city: 'Vienna', country: 'Austria' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland' },
  { code: 'MAD', name: 'Adolfo Suárez', city: 'Madrid', country: 'Spain' },
  { code: 'FCO', name: 'Leonardo da Vinci', city: 'Rome', country: 'Italy' },
  { code: 'MXP', name: 'Malpensa Airport', city: 'Milan', country: 'Italy' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark' },
];

/* ===== AIRPORT AUTOCOMPLETE ===== */
function setupAirportInput(inputId, codeId, suggestionsId) {
  const input = document.getElementById(inputId);
  const codeInput = document.getElementById(codeId);
  const suggestions = document.getElementById(suggestionsId);
  if (!input || !suggestions) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (q.length < 1) { suggestions.classList.remove('show'); return; }

    const matches = AIRPORTS.filter(a =>
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
    ).slice(0, 6);

    if (!matches.length) { suggestions.classList.remove('show'); return; }

    suggestions.innerHTML = matches.map(a => `
      <div class="dropdown-item" data-code="${a.code}" data-name="${a.city} (${a.code})">
        <span class="airport-code">${a.code}</span>
        <span class="text-dark">${a.city}</span>
        <small class="text-muted ms-1">— ${a.name}</small>
      </div>
    `).join('');
    suggestions.classList.add('show');

    suggestions.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        input.value = item.dataset.name;
        if (codeInput) codeInput.value = item.dataset.code;
        suggestions.classList.remove('show');
      });
    });
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !suggestions.contains(e.target)) {
      suggestions.classList.remove('show');
    }
  });
}

/* ===== TRIP TYPE TOGGLE ===== */
function setupTripTypeTabs() {
  const tabs = document.querySelectorAll('.trip-tab');
  const typeInput = document.getElementById('tripTypeInput');
  const returnCol = document.getElementById('returnDateCol');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const type = tab.dataset.type;
      if (typeInput) typeInput.value = type;
      if (returnCol) {
        returnCol.style.display = type === 'round-trip' ? '' : 'none';
      }
    });
  });

  // Init
  if (returnCol) returnCol.style.display = 'none';
  const activeTab = document.querySelector('.trip-tab.active');
  if (activeTab && returnCol) {
    returnCol.style.display = activeTab.dataset.type === 'round-trip' ? '' : 'none';
  }
}

/* ===== SWAP AIRPORTS ===== */
function setupSwap() {
  const swapBtn = document.getElementById('swapBtn');
  if (!swapBtn) return;
  swapBtn.addEventListener('click', () => {
    const originDisplay = document.getElementById('originDisplay');
    const destDisplay = document.getElementById('destinationDisplay');
    const originCode = document.getElementById('originCode');
    const destCode = document.getElementById('destinationCode');
    if (!originDisplay || !destDisplay) return;

    [originDisplay.value, destDisplay.value] = [destDisplay.value, originDisplay.value];
    if (originCode && destCode) {
      [originCode.value, destCode.value] = [destCode.value, originCode.value];
    }
    swapBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => swapBtn.style.transform = '', 300);
  });
}

/* ===== PASSENGER SELECTOR ===== */
function setupPassengerSelector() {
  const counts = { adults: 1, children: 0, infants: 0 };

  function updateLabel() {
    const total = counts.adults + counts.children + counts.infants;
    const label = document.getElementById('passLabel');
    if (label) label.textContent = `${total} Passenger${total !== 1 ? 's' : ''}`;
  }

  function setVal(type, val) {
    const el = document.getElementById(`pax-${type}`);
    const inp = document.getElementById(`pax-${type}-val`);
    if (el) el.textContent = val;
    if (inp) inp.value = val;
  }

  // Init display
  setVal('adults', 1);
  setVal('children', 0);
  setVal('infants', 0);
  updateLabel();

  document.querySelectorAll('.pax-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      counts[type] = Math.min(counts[type] + 1, 9);
      setVal(type, counts[type]);
      updateLabel();
    });
  });

  document.querySelectorAll('.pax-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const min = parseInt(btn.dataset.min || 0);
      counts[type] = Math.max(counts[type] - 1, min);
      setVal(type, counts[type]);
      updateLabel();
    });
  });

  // Keep dropdown open on click inside
  const dropdown = document.getElementById('passengerDropdown');
  if (dropdown) {
    dropdown.addEventListener('click', e => e.stopPropagation());
  }

  const applyBtn = document.getElementById('applyPassengers');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const dropEl = document.getElementById('passDropBtn');
      if (dropEl) bootstrap.Dropdown.getInstance(dropEl)?.hide();
    });
  }
}

/* ===== CARD NUMBER FORMATTING ===== */
function setupCardInput() {
  const cardNum = document.getElementById('cardNumber');
  if (!cardNum) return;
  cardNum.addEventListener('input', e => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = val;
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  setupAirportInput('originDisplay', 'originCode', 'originSuggestions');
  setupAirportInput('destinationDisplay', 'destinationCode', 'destinationSuggestions');
  setupTripTypeTabs();
  setupSwap();
  setupPassengerSelector();
  setupCardInput();
});
