const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
  project: {
    type: mongoose.Types.ObjectId,
    ref: 'project'
  },
  stories: [
    {
      type: [mongoose.Types.ObjectId],
      ref: 'storie'
    }
  ],
  team: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'user'
    }
  ],
  description: {
    type: String
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  }
});

module.exports = Sprint = mongoose.model('sprint', sprintSchema);
