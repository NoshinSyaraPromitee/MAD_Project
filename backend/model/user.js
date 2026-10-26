const mongoose = require('mongoose');

// An account can be email+password, Google, or both (linked by email).
// A Google-only account has no passwordHash, so password login can never
// succeed for it. An email-only account has no googleId.
const userSchema = new mongoose.Schema(
  {
    googleId: { type: String }, // Google's stable "sub"; absent for email-only accounts
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: '', trim: true },
    avatarUrl: { type: String, default: '' },
    passwordHash: { type: String, select: false }, // never returned unless asked for
  },
  { timestamps: true }
);

// Unique only when googleId is actually a string. A plain `unique: true`
// would treat every email-only user's missing googleId as a duplicate.
userSchema.index(
  { googleId: 1 },
  { unique: true, partialFilterExpression: { googleId: { $type: 'string' } } }
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = String(ret._id); // Go-style alias; _id stays for existing clients
    delete ret.passwordHash;
    delete ret.googleId;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);