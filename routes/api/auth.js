const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const userValidations = [
  check('email', 'Por favor, digite um email válido!').isEmail(),
  check('password', 'A senha é obrigatória.').exists()
];

// @route   GET api/auth
// @desc    Check token validation
// @access  public
router.get('/', async (req, res) => {
  if (req.headers && req.headers.authorization) {
    let authorization = req.headers.authorization,
      decoded;

    try {
      decoded = jwt.verify(authorization, config.get('jwtSecret'));

      res.json({ user: decoded.user });
    } catch (err) {
      return res.status(401).json({
        errors: [
          {
            msg:
              'Você não possui permissão, por favor, contate o administrador do sistema.'
          }
        ]
      });
    }
  } else {
    return res.status(401).json({
      errors: [
        {
          msg:
            'Você não possui permissão, por favor, contate o administrador do sistema.'
        }
      ]
    });
  }
});

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
        id: user._id,
        name: user.name,
        level: user.level
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
