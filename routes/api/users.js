const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');

const User = require('../../models/User');

const userValidations = [
  check('name', 'O nome é obrigatório!')
    .not()
    .isEmpty(),
  check('cpf', 'O CPF é obrigatório!')
    .not()
    .isEmpty(),
  check('email', 'Por favor, digite um email válido!').isEmail(),
  check(
    'password',
    'Por favor, digite uma senha com 8 ou mais caracteres.'
  ).isLength({
    min: 8
  }),
  check('level', 'O nível de usuário é obrigatório!')
    .not()
    .isEmpty()
];

// @route   POST api/users
// @desc    register user
// @access  private
router.post('/', auth, userValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    email,
    password,
    cpf,
    level,
    phone_number,
    hour_value,
    avatar
  } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.findOne({ cpf });
    }

    if (user) {
      return res.status(400).json({
        error: [
          {
            msg: 'Usuário já existente!'
          }
        ]
      });
    } else {
      user = new User({
        name,
        email,
        cpf,
        level,
        phone_number: phone_number ? phone_number : '',
        hour_value: hour_value ? hour_value : '',
        avatar: avatar ? avatar : ''
      });
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ msg: 'Usuário registrado com sucesso!', user });
  } catch (err) {
    res.status(500).json({
      error: [
        {
          msg:
            'Algo deu errado, por favor verifique sua conexão e tente novamente.'
        }
      ]
    });
  }
});

module.exports = router;
