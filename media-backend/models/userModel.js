const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  username: {
   type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+@.+\..+/,
    lowercase: true,
    trim: true
  },
  contactno: String,
  age: {
    type: Number,
    min: 0
  },
  password: String,
  bio: {
    type: String,
    default: ''
  },
  verificationCode: String,
  birthdate: Date,
  profilePic: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  codeExpiresAt: Date,
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;