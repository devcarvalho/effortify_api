const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  project: {
    type: mongoose.Types.ObjectId,
    ref: 'project'
  },
  sprint: {
    type: mongoose.Types.ObjectId,
    ref: 'sprint'
  },
  storie: {
    type: mongoose.Types.ObjectId,
    ref: 'storie'
  },
  assigned_to: [
    {
      type: mongoose.Types.ObjectId,
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
