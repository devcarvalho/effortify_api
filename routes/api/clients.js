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
router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
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

// @route   GET api/clients/:id
// @desc    get and return client by id
// @access  private
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ msg: 'Cliente não encontrado!' });
    }

    res.json(client);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Cliente não encontrado!' });
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

// @route   PUT api/clients
// @desc    update client
// @access  private
router.put('/:id', [auth, clientValidations], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, cnpj, email, phone_number, avatar } = req.body;

  try {
    const criteria = { _id: req.params.id };

    await Client.updateOne(criteria, {
      $set: { name, cnpj, email, phone_number, avatar }
    });

    res.json({ msg: 'Cliente atualizado com sucesso!' });
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

// @route   DELETE api/clients/:id
// @desc    remove client
// @access  private
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ msg: 'Cliente não encontrado!' });
    }
    await client.remove();
    res.json({ msg: 'Cliente removido com sucesso!' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Cliente não encontrado!' });
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
