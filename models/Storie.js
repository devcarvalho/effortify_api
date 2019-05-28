const mongoose = require('mongoose');

const storieSchema = new mongoose.Schema({
  sprint: {
    type: mongoose.Types.ObjectId,
    ref: 'sprint'
  },
  tasks: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'task'
    }
  ],
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
