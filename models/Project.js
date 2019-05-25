const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  client: {
    type: mongoose.Types.ObjectId,
    ref: 'client'
  },
  sprints: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'sprint'
    }
  ],
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  value: {
    type: Number
  }
});

module.exports = Project = mongoose.model('project', projectSchema);
