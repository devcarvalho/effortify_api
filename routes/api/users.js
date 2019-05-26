const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');

const userValidations = [
  check('name', 'O nome é obrigatório!')
    .not()
    .isEmpty(),
  check('cpf', 'O CPF é obrigatório!')
    .not()
    .isEmpty(),
  check('role', 'O cargo é obrigatório!')
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

// @route   GET api/users
// @desc    get and return users
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
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

// @route   GET api/users/:id
// @desc    get and return user by id
// @access  private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }
    res.json(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }
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

// @route   POST api/users
// @desc    register user
// @access  private
router.post('/', [auth, userValidations], async (req, res) => {
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
    role,
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
        role,
        phone_number: phone_number ? phone_number : '',
        hour_value: hour_value ? hour_value : '',
        avatar: avatar ? avatar : ''
      });
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ msg: 'Usuário registrado com sucesso!' });
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

// @route   PUT api/users/:id
// @desc    update user
// @access  private
router.put('/:id', [auth, userValidations], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password, role, phone_number, hour_value, avatar } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);

    const newPassword = await bcrypt.hash(password, salt);

    const criteria = { _id: req.params.id };

    await User.updateOne(criteria, {
      $set: { password: newPassword, avatar, phone_number, hour_value, role }
    });

    res.json({ msg: 'Usuário atualizado com sucesso!' });
  } catch (err) {
    console.log(err);
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

// @route   DELETE api/users/:id
// @desc    remove user
// @access  private
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }
    await user.remove();
    res.json({ msg: 'Usuário removido com sucesso!' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }
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
