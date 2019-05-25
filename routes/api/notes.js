const express = require('express');
const router = express.Router();

// @route   GET api/notes
// @desc    test route
// @access  public
router.get('/', (req, res) => {
  res.send('Notes Route');
});

module.exports = router;
