const express = require('express');
const router = express.Router();

// @route   GET api/clients
// @desc    test route
// @access  public
router.get('/', (req, res) => {
  res.send('Clients Route');
});

module.exports = router;
