const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String }, // null for Google OAuth users
  avatar: { type: String },   // Google profile photo URL
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

// Generate initials avatar fallback
userSchema.virtual('initials').get(function () {
  return this.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

module.exports = mongoose.model('User', userSchema);
