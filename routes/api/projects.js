const express = require('express');
const router = express.Router();

const Project = require('../../models/Project');
const Client = require('../../models/Client');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const projectValidations = [
  check('client', 'O cliente é obrigatório!')
    .not()
    .isEmpty(),
  check('name', 'O nome é obrigatório!')
    .not()
    .isEmpty()
];

// @route   GET api/projects
// @desc    get and return projects
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
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

// @route   GET api/projects/:id
// @desc    get and return project by id
// @access  private
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Projeto não encontrado!' });
    }

    res.json(project);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Projeto não encontrado!' });
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

// @route   GET api/projects/client/:id
// @desc    get and return projects by client id
// @access  private
router.get('/client/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ msg: 'Cliente não encontrado!' });
    }

    const projects = await Project.find({ client: req.params.id });

    if (!projects) {
      return res
        .status(404)
        .json({ msg: 'Não foram encontrados projetos para este cliente!' });
    }

    res.json(projects);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res
        .status(404)
        .json({ msg: 'Não foram encontrados projetos para este cliente!' });
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

// @route   POST api/projects
// @desc    add new project
// @access  private
router.post('/', [auth, projectValidations], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, client, description, start_date, value } = req.body;

  try {
    const newProject = new Project({
      name,
      client,
      description,
      start_date,
      value
    });

    const project = await newProject.save();

    res.json({ msg: 'Projeto cadastrado com sucesso!', project });
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

// @route   PUT api/projects
// @desc    update project
// @access  private
router.put('/:id', [auth, projectValidations], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, client, description, start_date, value } = req.body;

  try {
    const criteria = { _id: req.params.id };

    await Project.updateOne(criteria, {
      $set: { name, client, description, start_date, value }
    });

    res.json({ msg: 'Projeto atualizado com sucesso!' });
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

// @route   DELETE api/projects/:id
// @desc    remove project
// @access  private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Projeto não encontrado!' });
    }
    await project.remove();
    res.json({ msg: 'Projeto removido com sucesso!' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Projeto não encontrado!' });
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
