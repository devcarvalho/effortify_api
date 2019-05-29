const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  storie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'storie'
  },
  assigned_to: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  wi: {
    type: String
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  skill: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  etimated_effort: {
    type: Number
  },
  effort: {
    type: Number
  },
  balance: {
    type: Number
  }
});

module.exports = Task = mongoose.model('task', taskSchema);
