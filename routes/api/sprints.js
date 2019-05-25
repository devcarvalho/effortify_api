const express = require('express');
const router = express.Router();

// @route   GET api/sprints
// @desc    test route
// @access  public
router.get('/', (req, res) => {
  res.send('Sprints Route');
});

module.exports = router;
