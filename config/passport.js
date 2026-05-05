require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// ===== SERIALIZE / DESERIALIZE =====
passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ===== LOCAL STRATEGY =====
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return done(null, false, { message: 'No account found with that email.' });
      if (user.provider === 'google') return done(null, false, { message: 'This email is linked to a Google account. Please sign in with Google.' });
      const valid = await user.comparePassword(password);
      if (!valid) return done(null, false, { message: 'Incorrect password.' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// ===== GOOGLE STRATEGY =====
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id') {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/users/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // Check if email already exists (local account)
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findOne({ email });
          if (user) {
            // Link Google to existing account
            user.googleId = profile.id;
            user.provider = 'google';
            user.avatar = profile.photos?.[0]?.value;
            await user.save();
            return done(null, user);
          }
        }

        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: email || `google_${profile.id}@placeholder.com`,
          googleId: profile.id,
          provider: 'google',
          avatar: profile.photos?.[0]?.value,
          isVerified: true,
        });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
}

module.exports = passport;
