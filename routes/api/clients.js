const express = require('express');
const router = express.Router();

const Client = require('../../models/Client');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const clientValidations = [
  check('name', 'O nome é obrigatório!')
    .not()
    .isEmpty()
];

// @route   GET api/clients
// @desc    get and return clients
// @access  private
router.get('/', (req, res) => {
  res.send('Clients Route');
});

// @route   POST api/clients
// @desc    add new client
// @access  private
router.post('/', [auth, clientValidations], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, cnpj, email, phone_number, avatar } = req.body;

  try {
    const newClient = new Client({
      name,
      cnpj,
      email,
      phone_number,
      avatar
    });

    const client = await newClient.save();

    res.json({ msg: 'Cliente registrado com sucesso!', client });
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
