const express = require('express');
const router = express.Router();

const Storie = require('../../models/Storie');
const Sprint = require('../../models/Sprint');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const storieValidations = [
  check('sprint', 'A sprint é obrigatória!')
    .not()
    .isEmpty()
];

// @route   GET api/stories
// @desc    get and return stories
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    const stories = await Storie.find();
    res.json(stories);
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

// @route   GET api/stories/:id
// @desc    get and return storie by id
// @access  private
router.get('/:id', auth, async (req, res) => {
  try {
    const storie = await Storie.findById(req.params.id);

    if (!storie) {
      return res.status(404).json({ msg: 'Estória não encontrada!' });
    }

    res.json(storie);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Estória não encontrada!' });
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

// @route   GET api/stories/sprint/:id
// @desc    get and return stories by sprint id
// @access  private
router.get('/sprint/:id', auth, async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);

    if (!sprint) {
      return res.status(404).json({ msg: 'Sprint não encontrada!' });
    }

    const stories = await Stories.find({ sprint: req.params.id });

    if (!stories) {
      return res
        .status(404)
        .json({ msg: 'Não foram encontradas estórias para esta sprint!' });
    }

    res.json(stories);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ msg: 'Não foram encontradas estórias para esta sprint!' });
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

// @route   POST api/stories
// @desc    add new storie
// @access  private
router.post('/', [auth, storieValidations], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { sprint, wi, priority, description, url } = req.body;

  try {
    const newStorie = new Storie({
      sprint,
      wi,
      priority,
      description,
      url
    });

    const storie = await newStorie.save();

    res.json({ msg: 'Estória cadastrada com sucesso!', storie });
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

// @route   PUT api/stories/:id
// @desc    update storie
// @access  private
router.put('/:id', [auth, storieValidations], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { wi, priority, description, url } = req.body;

  try {
    const criteria = { _id: req.params.id };

    await Storie.updateOne(criteria, {
      $set: { wi, priority, description, url }
    });

    res.json({ msg: 'Estória atualizada com sucesso!' });
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

// @route   DELETE api/stories/:id
// @desc    remove storie
// @access  private
router.delete('/:id', auth, async (req, res) => {
  try {
    const storie = await Storie.findById(req.params.id);
    if (!storie) {
      return res.status(404).json({ msg: 'Estória não encontrada!' });
    }
    await storie.remove();
    res.json({ msg: 'Estória removida com sucesso!' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Estória não encontrada!' });
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
