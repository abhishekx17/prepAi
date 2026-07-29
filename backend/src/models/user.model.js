const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, 'username already taken'],
    required: true,
  },

  email: {
    type: String,
    unique: [true, 'Account already exists with this email address'],
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  tier: {
    type: String,
    enum: ['Free', 'Pro', 'Enterprise'],
    default: 'Free',
  },

  usage: {
    resumesAnalyzed: { type: Number, default: 0 },
    interviewsStarted: { type: Number, default: 0 },
    quizzesTaken: { type: Number, default: 0 },
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
