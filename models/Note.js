const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  task: {
    type: mongoose.Types.ObjectId,
    ref: 'task'
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  warning: {
    type: String
  },
  effort: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = Note = mongoose.model('note', noteSchema);
