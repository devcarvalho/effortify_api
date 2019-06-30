const express = require('express');
const router = express.Router();

const Project = require('../../models/Project');
const Sprint = require('../../models/Sprint');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const sprintValidations = [
  check('project', 'O projeto é obrigatório!')
    .not()
    .isEmpty(),
  check('start_date', 'A data inicial é obrigatória!')
    .not()
    .isEmpty(),
  check('end_date', 'A data final é obrigatória!')
    .not()
    .isEmpty()
];

// @route   GET api/sprints
// @desc    get and return sprints
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    const sprints = await Sprint.find();
    res.json(sprints);
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

// @route   GET api/sprints/:id
// @desc    get and return sprint by id
// @access  private
router.get('/:id', auth, async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);

    if (!sprint) {
      return res.status(404).json({ msg: 'Sprint não encontrada!' });
    }

    res.json(sprint);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Sprint não encontrada!' });
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

// @route   GET api/sprints/project/:id
// @desc    get and return sprints by project id
// @access  private
router.get('/project/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Projeto não encontrado!' });
    }

    const sprints = await Sprint.find({ project: req.params.id });

    if (!sprints) {
      return res
        .status(404)
        .json({ msg: 'Não foram encontradas sprints para este projeto!' });
    }

    res.json(sprints);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ msg: 'Não foram encontradas sprints para este projeto!' });
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

// @route   POST api/sprints
// @desc    add new sprint
// @access  private
router.post('/', [auth, sprintValidations], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, project, team, description, start_date, end_date } = req.body;

  try {
    const newSprint = new Sprint({
      name,
      project,
      team,
      description,
      start_date,
      end_date
    });

    const sprint = await newSprint.save();

    res.json({ msg: 'Sprint cadastrada com sucesso!', sprint });
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

// @route   PUT api/sprints/:id
// @desc    update sprint
// @access  private
router.put('/:id', [auth, sprintValidations], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, team, project, description, start_date, end_date } = req.body;

  try {
    const criteria = { _id: req.params.id };

    await Sprint.updateOne(criteria, {
      $set: { name, team, project, description, start_date, end_date }
    });

    res.json({ msg: 'Sprint atualizada com sucesso!' });
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

// @route   DELETE api/sprints/:id
// @desc    remove sprint
// @access  private
router.delete('/:id', auth, async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ msg: 'Sprint não encontrada!' });
    }
    await sprint.remove();
    res.json({ msg: 'Sprint removida com sucesso!' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Sprint não encontrada!' });
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
