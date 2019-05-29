const express = require('express');
const router = express.Router();

const Note = require('../../models/Note');
const Task = require('../../models/Task');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const noteValidations = [
  check('task', 'A tarefa é obrigatória!')
    .not()
    .isEmpty(),
  check('user', 'O usuário é obrigatório!')
    .not()
    .isEmpty(),
  check('effort', 'O esforço é obrigatório!')
    .not()
    .isEmpty(),
  check('date', 'A data é obrigatória!')
    .not()
    .isEmpty()
];

// @route   GET api/notes
// @desc    get and return notes
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Notes.find();
    res.json(notes);
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

// @route   GET api/notes/:id
// @desc    get and return note by id
// @access  private
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: 'Apontamento não encontrado!' });
    }

    res.json(task);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Apontamento não encontrado!' });
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

// @route   GET api/notes/task/:id
// @desc    get and return notes by task id
// @access  private
router.get('/task/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Tarefa não encontrada!' });
    }

    const notes = await Note.find({ task: req.params.id });

    if (!notes) {
      return res
        .status(404)
        .json({ msg: 'Não foram encontrados apontamentos para esta tarefa!' });
    }

    res.json(notes);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ msg: 'Não foram encontrados apontamentos para esta tarefa!' });
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

// @route   GET api/notes/user/:id
// @desc    get and return notes by user id
// @access  private
router.get('/user/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }

    const notes = await Note.find({ user: req.params.id });

    if (!notes) {
      return res
        .status(404)
        .json({ msg: 'Não foram encontrados apontamentos para este usuário!' });
    }

    res.json(notes);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ msg: 'Não foram encontrados apontamentos para este usuário!' });
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

// @route   POST api/notes
// @desc    add new note
// @access  private
router.post('/', [auth, noteValidations], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { task, user, warning, effort, date } = req.body;

  try {
    const newNote = new Task({
      task,
      user,
      warning,
      effort,
      date
    });

    const note = await newNote.save();

    res.json({ msg: 'Apontamento cadastrado com sucesso!', note });
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

// @route   PUT api/notes/:id
// @desc    update note
// @access  private
router.put('/:id', [auth, noteValidations], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { warning, effort, date } = req.body;

  try {
    const criteria = { _id: req.params.id };

    await Task.updateOne(criteria, {
      $set: {
        warning,
        effort,
        date
      }
    });

    res.json({ msg: 'Apontamento atualizado com sucesso!' });
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

// @route   DELETE api/notes/:id
// @desc    remove note
// @access  private
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: 'Apontamento não encontrado!' });
    }
    await note.remove();
    res.json({ msg: 'Apontamento removido com sucesso!' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Apontamento não encontrado!' });
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
