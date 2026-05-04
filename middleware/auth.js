// Protect routes - redirect to login if not authenticated
exports.requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.session.returnTo = req.originalUrl;
  res.redirect('/auth/login');
};

// Redirect to home if already logged in
exports.redirectIfLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect('/');
  next();
};
