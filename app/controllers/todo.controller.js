var mongoose = require('mongoose');
var Nexmo = require('nexmo');
var Todo = require('../models/todo');

// Text messaging functionality
var nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET
});

module.exports = {
  getAllTodos: function(req, res) {
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
  },
  newTodo: function(req, res) {
    console.log(req.body.dueDate);
    var todo = new Todo({
      title: req.body.title,
      dueDate: new Date(req.body.dueDate),
      details: req.body.details
    });

    todo.save(function() {
      // Send Text Message
      nexmo.message.sendSms(process.env.VIRTUAL_NUMBER, '16266026587', req.body.title+' ',
        (err, responseData) => {
          if (err) {
            console.log(err);
          } else {
            console.dir(responseData);
          }
        }
      );
      req.flash('success', 'New task created!');
      res.redirect('/todos');
    });
  },
  deleteTodo: function(req, res) {
    Todo.remove({_id:req.params.id}, function(err, todo) {
      req.flash('success', 'Task has been deleted!');
      res.redirect('/todos');
    });
  },
  updateTodo: function(req, res) {
    Todo.findOne({_id:req.params.id}, function(err, todo) {
      todo.title = req.body.title;
      todo.dueDate = new Date(req.body.dueDate);
      todo.details = req.body.details;

      todo.save(function() {
        nexmo.message.sendSms(process.env.VIRTUAL_NUMBER, '16266026587', req.body.title,
	  (err, responseData) => {
	    if (err) {
	      console.log(err);
	    } else {
	      console.dir(responseData);
	    }
	  }
	);	
        req.flash('success', 'Task has been updated!');
	res.redirect('/todos');
      });
    });
  }
}
