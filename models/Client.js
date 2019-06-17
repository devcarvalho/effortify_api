const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cnpj: {
    type: String
  },
  email: {
    type: String
  },
  phone_number: {
    type: String
  },
  avatar: {
    type: Buffer
  }
});

module.exports = Client = mongoose.model('client', clientSchema);
