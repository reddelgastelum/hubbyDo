var router = require('express').Router();
var todoController = require('../controllers/todo.controller');

// Todos
router.get('/', todoController.getAllTodos);

// New Todo
router.post('/', todoController.newTodo);

// Delete Todo
router.get('/delete/:id', todoController.deleteTodo);

// Update Todo
router.post('/update/:id', todoController.updateTodo);


module.exports = router;
