const express = require('express');
const router = express.Router();

// @route   GET api/projects
// @desc    test route
// @access  public
router.get('/', (req, res) => {
  res.send('Projects Route');
});

module.exports = router;
