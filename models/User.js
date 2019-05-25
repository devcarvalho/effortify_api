const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  phone_number: {
    type: String
  },
  hour_value: {
    type: String
  },
  avatar: {
    type: String
  }
});

module.exports = User = mongoose.model('user', userSchema);