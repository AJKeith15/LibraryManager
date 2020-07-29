var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var books = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', books);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  console.log('404 error 1')
  res.status(404).render("page-not-found")
});

// global error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  if (err.status === 404) {
    console.log('404 error 2')
    res.status(404).render("page-not-found", {err})
  } else {
    console.log('Not 404 error')
    err.message = err.message || 'Oops! Something went wrong with the server :('
    res.status(err.status || 500).render("error-handler", {err})
  }
});

module.exports = app;
