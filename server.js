var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

// .env configuration functionality
require('dotenv').config();

var app = express();

// Port
var port = process.env.PORT || 8080;

// Mongoose
mongoose.connect(process.env.DATABASE_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongo connected to: ' + process.env.DATABASE_URI);
});

// Public
app.use('/public',express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Views
app.set('views', './app/views');
app.set('view engine', 'pug');

// Sessions
app.use(cookieParser('secret'));
app.use(session({
  saveUninitialized:true,
  resave:true,
  secret:'secret'
}));

// Flash Messages
app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Todos route
app.use('/todos', require('./app/routes/todos'));

app.listen(port, function() {
  console.log('Listening on port ' + port);
});
