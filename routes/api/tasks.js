const express = require('express');
const router = express.Router();

const Storie = require('../../models/Storie');
const Task = require('../../models/Task');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const taskValidations = [
  check('storie', 'A estória é obrigatória!')
    .not()
    .isEmpty(),
  check('type', 'O tipo é obrigatório!')
    .not()
    .isEmpty(),
  check('status', 'O status é obrigatório!')
    .not()
    .isEmpty(),
  check('skill', 'O skill é obrigatório!')
    .not()
    .isEmpty()
];

// @route   GET api/tasks
// @desc    get and return tasks
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Tasks.find();
    res.json(tasks);
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

// @route   GET api/tasks/:id
// @desc    get and return task by id
// @access  private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task não encontrada!' });
    }

    res.json(task);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task não encontrada!' });
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

// @route   GET api/tasks/storie/:id
// @desc    get and return tasks by storie id
// @access  private
router.get('/storie/:id', auth, async (req, res) => {
  try {
    const storie = await Storie.findById(req.params.id);

    if (!storie) {
      return res.status(404).json({ msg: 'Estória não encontrada!' });
    }

    const tasks = await Task.find({ storie: req.params.id });

    if (!tasks) {
      return res
        .status(404)
        .json({ msg: 'Não foram encontradas atividades para esta estória!' });
    }

    res.json(tasks);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ msg: 'Não foram encontradas atividades para esta estória!' });
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

// @route   POST api/tasks
// @desc    add new task
// @access  private
router.post('/', [auth, taskValidations], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    storie,
    assigned_to,
    wi,
    type,
    status,
    skill,
    description,
    estimated_effort,
    effort,
    balance
  } = req.body;

  try {
    const newTask = new Task({
      storie,
      assigned_to,
      wi,
      type,
      status,
      skill,
      description,
      estimated_effort
    });

    const task = await newTask.save();

    res.json({ msg: 'Atividade cadastrada com sucesso!', task });
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

// @route   PUT api/tasks/:id
// @desc    update task
// @access  private
router.put('/:id', [auth, taskValidations], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    storie,
    assigned_to,
    wi,
    type,
    status,
    skill,
    description,
    estimated_effort,
    effort
  } = req.body;

  try {
    const criteria = { _id: req.params.id };

    await Task.updateOne(criteria, {
      $set: {
        storie,
        assigned_to,
        wi,
        type,
        status,
        skill,
        description,
        estimated_effort,
        effort,
        balance: estimated_effort - effort
      }
    });

    res.json({ msg: 'Atividade atualizada com sucesso!' });
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

// @route   DELETE api/tasks/:id
// @desc    remove task
// @access  private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Atividade não encontrada!' });
    }
    await task.remove();
    res.json({ msg: 'Atividade removida com sucesso!' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Atividade não encontrada!' });
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
