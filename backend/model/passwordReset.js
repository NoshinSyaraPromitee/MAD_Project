const mongoose = require('mongoose');

// One live reset code per email. Stored in Mongo (not in memory like the Go
// version) so it survives a server restart and works with >1 instance.
const passwordResetSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
