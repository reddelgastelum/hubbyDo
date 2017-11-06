var mongoose = require('mongoose');


var todoSchema = mongoose.Schema({
  title: {
    type:String,
    required:true
  },
  dueDate: {
    type:Date,
    required:true
  },
  details: {
    type:String
  }
});

var Todo = module.exports = mongoose.model('Todo', todoSchema, 'todo');
