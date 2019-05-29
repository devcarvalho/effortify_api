const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const userValidations = [
  check('email', 'Por favor, digite um email válido!').isEmail(),
  check('password', 'A senha é obrigatória.').exists()
];

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  public
router.post('/', userValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Usuário inexistente!'
          }
        ]
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Senha incorreta!'
          }
        ]
      });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, config.get('jwtSecret'), (err, token) => {
      if (err) throw err;
      res.json({ token, user });
    });
  } catch (err) {
    res.status(500).json({
      errors: [
        {
          msg:
            'Algo deu errado, por favor verifique sua conexão e tente novamente.'
        }
      ]
    });
  }
});

module.exports = router;
