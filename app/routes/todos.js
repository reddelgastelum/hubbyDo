var router = require('express').Router();
var mongoose = require('mongoose');
var Nexmo = require('nexmo');
var Todo = require('../models/todo');

var nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET
});

// Todos
router.get('/', function(req, res) {
  Todo.find({}).sort('dueDate').exec(function(err, todos) {

    if (todos.length > 0) {
      for (var i = 0; i < todos.length; i++) {
        var d = new Date(todos[i].dueDate);
        todos[i].date = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
      }
    }

    res.render('index', {
      todos: todos
    });
  });
});

// New Todo
router.post('/', function(req, res) {
  console.log(req.body.dueDate);
  var todo = new Todo({
    title: req.body.title,
    dueDate: new Date(req.body.dueDate),
    details: req.body.details
  });



  todo.save(function() {

    nexmo.message.sendSms(process.env.VIRTUAL_NUMBER, '16266026587', req.body.title+' ',
      (err, responseData) => {
        if (err) {
          console.log(err);
        } else {
          console.dir(responseData);
        }
      }
   );

    res.redirect('/todos');
  });
});

// Delete Todo
router.get('/delete/:id', function(req, res) {
  Todo.remove({_id:req.params.id}, function(err, todo) {
    res.redirect('/todos');
  });
});

module.exports = router;
