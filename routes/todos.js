const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

let todos = [];
let nextId = 1;

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all todos
router.get('/', (req, res) => {
  res.json(todos);
});

// Get a single todo
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Create a todo
router.post('/',
  [
    body('title').notEmpty().withMessage('Title is required').isString().withMessage('Title must be a string'),
    body('completed').optional().isBoolean().withMessage('Completed must be a boolean')
  ],
  validate,
  (req, res) => {
    const { title, completed } = req.body;
    const newTodo = {
      id: nextId++,
      title,
      completed: completed || false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
  }
);

// Update a todo
router.put('/:id',
  [
    body('title').optional().isString().withMessage('Title must be a string'),
    body('completed').optional().isBoolean().withMessage('Completed must be a boolean')
  ],
  validate,
  (req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex > -1) {
      if (title !== undefined) todos[todoIndex].title = title;
      if (completed !== undefined) todos[todoIndex].completed = completed;
      res.json(todos[todoIndex]);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  }
);

// Delete a todo
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex > -1) {
    todos.splice(todoIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

module.exports = router;
