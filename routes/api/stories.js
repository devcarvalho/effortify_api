const express = require('express');
const router = express.Router();

// @route   GET api/stories
// @desc    test route
// @access  public
router.get('/', (req, res) => {
  res.send('Stories Route');
});

module.exports = router;
