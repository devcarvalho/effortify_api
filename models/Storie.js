const mongoose = require('mongoose');

const storieSchema = new mongoose.Schema({
  sprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sprint'
  },
  wi: {
    type: String
  },
  priority: {
    type: Number
  },
  description: {
    type: String
  },
  url: {
    type: String
  }
});

module.exports = Storie = mongoose.model('storie', storieSchema);
