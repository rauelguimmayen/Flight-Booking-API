/* auth.js — Login & Register page interactions */

/* ===== PASSWORD VISIBILITY TOGGLE ===== */
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    const isPassword = target.type === 'password';
    target.type = isPassword ? 'text' : 'password';
    btn.querySelector('i').className = isPassword ? 'bi bi-eye-slash text-muted' : 'bi bi-eye text-muted';
  });
});

/* ===== PASSWORD STRENGTH METER ===== */
window.checkPasswordStrength = function(value) {
  const bar = document.getElementById('strengthBar');
  const progress = document.getElementById('strengthProgress');
  const label = document.getElementById('strengthLabel');
  if (!bar || !progress || !label) return;

  if (!value) { bar.style.display = 'none'; return; }
  bar.style.display = 'block';

  let score = 0;
  if (value.length >= 6)  score++;
  if (value.length >= 10) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const levels = [
    { pct: 20,  color: '#ef4444', text: 'Very weak' },
    { pct: 40,  color: '#f97316', text: 'Weak' },
    { pct: 60,  color: '#eab308', text: 'Fair' },
    { pct: 80,  color: '#22c55e', text: 'Strong' },
    { pct: 100, color: '#16a34a', text: 'Very strong' },
  ];
  const level = levels[Math.min(score, 4)];
  progress.style.width = level.pct + '%';
  progress.style.background = level.color;
  label.textContent = level.text;
  label.style.color = level.color;
};

/* ===== REGISTER FORM VALIDATION ===== */
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', e => {
    const pwd = document.getElementById('regPassword')?.value;
    const confirm = document.getElementById('confirmPassword')?.value;
    const agree = document.getElementById('agreeTerms');
    const errEl = document.getElementById('passwordMatchError');

    let valid = true;

    if (pwd !== confirm) {
      errEl?.classList.remove('d-none');
      document.getElementById('confirmPassword')?.classList.add('is-invalid');
      valid = false;
    } else {
      errEl?.classList.add('d-none');
      document.getElementById('confirmPassword')?.classList.remove('is-invalid');
    }

    if (agree && !agree.checked) {
      agree.classList.add('is-invalid');
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
      return;
    }

    // Loading state
    const btn = document.getElementById('registerBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating account...';
    }
  });
}

/* ===== LOGIN FORM LOADING STATE ===== */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', () => {
    const btn = document.getElementById('loginBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing in...';
    }
  });
}
