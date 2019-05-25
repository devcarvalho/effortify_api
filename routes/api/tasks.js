const express = require('express');
const router = express.Router();

// @route   GET api/tasks
// @desc    test route
// @access  public
router.get('/', (req, res) => {
  res.send('Tasks Route');
});

module.exports = router;
