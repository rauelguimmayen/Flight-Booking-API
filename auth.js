const express = require('express');
const router = express.Router();
const passport = require('./passport');
const User = require('./models/User');
const { redirectIfLoggedIn, requireAuth } = require('./middleware/auth');

// ===== LOGIN PAGE =====
router.get('/login', redirectIfLoggedIn, (req, res) => {
  const error = req.session.authError;
  const success = req.session.authSuccess;
  delete req.session.authError;
  delete req.session.authSuccess;

  res.render('pages/auth/login', {
    title: 'Sign In – SkyRoam',
    error,
    success,
    googleEnabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id'),
  });
});

// ===== REGISTER PAGE =====
router.get('/register', redirectIfLoggedIn, (req, res) => {
  const error = req.session.authError;
  delete req.session.authError;

  res.render('pages/auth/register', {
    title: 'Create Account – SkyRoam',
    error,
    googleEnabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id'),
  });
});

// ===== REGISTER POST =====
router.post('/register', redirectIfLoggedIn, async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validation
  if (!name || !email || !password) {
    req.session.authError = 'All fields are required.';
    return res.redirect('/auth/register');
  }
  if (password.length < 6) {
    req.session.authError = 'Password must be at least 6 characters.';
    return res.redirect('/auth/register');
  }
  if (password !== confirmPassword) {
    req.session.authError = 'Passwords do not match.';
    return res.redirect('/auth/register');
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      req.session.authError = 'An account with that email already exists.';
      return res.redirect('/auth/register');
    }

    const user = await User.create({ name, email, password, provider: 'local' });

    // Auto-login after registration
    req.login(user, err => {
      if (err) {
        req.session.authError = 'Registration succeeded but login failed. Please sign in.';
        return res.redirect('/auth/login');
      }
      res.redirect('/');
    });
  } catch (err) {
    console.error('Register error:', err);
    req.session.authError = 'Something went wrong. Please try again.';
    res.redirect('/auth/register');
  }
});

// ===== LOGIN POST =====
router.post('/login', redirectIfLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.session.authError = info?.message || 'Invalid credentials.';
      return res.redirect('/auth/login');
    }
    req.login(user, err => {
      if (err) return next(err);
      const returnTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      res.redirect(returnTo);
    });
  })(req, res, next);
});

// ===== GOOGLE OAUTH =====
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
  }
);

// ===== LOGOUT =====
router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => res.redirect('/auth/login'));
  });
});

// ===== PROFILE PAGE =====
router.get('/profile', requireAuth, (req, res) => {
  const success = req.session.profileSuccess;
  const error = req.session.profileError;
  delete req.session.profileSuccess;
  delete req.session.profileError;
  res.render('pages/auth/profile', {
    title: 'My Profile – SkyRoam',
    user: req.user,
    success,
    error,
  });
});

// ===== UPDATE NAME =====
router.post('/profile/update', requireAuth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      req.session.profileError = 'Name cannot be empty.';
      return res.redirect('/auth/profile');
    }
    await User.findByIdAndUpdate(req.user._id, { name: name.trim() });
    req.session.profileSuccess = 'Profile updated successfully.';
    res.redirect('/auth/profile');
  } catch (err) {
    req.session.profileError = 'Failed to update profile.';
    res.redirect('/auth/profile');
  }
});

// ===== CHANGE PASSWORD =====
router.post('/profile/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user._id);

    const valid = await user.comparePassword(currentPassword);
    if (!valid) {
      req.session.profileError = 'Current password is incorrect.';
      return res.redirect('/auth/profile');
    }
    if (newPassword.length < 6) {
      req.session.profileError = 'New password must be at least 6 characters.';
      return res.redirect('/auth/profile');
    }
    if (newPassword !== confirmPassword) {
      req.session.profileError = 'New passwords do not match.';
      return res.redirect('/auth/profile');
    }

    user.password = newPassword;
    await user.save();
    req.session.profileSuccess = 'Password changed successfully.';
    res.redirect('/auth/profile');
  } catch (err) {
    req.session.profileError = 'Failed to change password.';
    res.redirect('/auth/profile');
  }
});

// ===== DELETE ACCOUNT =====
router.post('/profile/delete', requireAuth, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    req.logout(err => {
      if (err) return next(err);
      req.session.destroy(() => res.redirect('/'));
    });
  } catch (err) {
    req.session.profileError = 'Failed to delete account.';
    res.redirect('/auth/profile');
  }
});

module.exports = router;
