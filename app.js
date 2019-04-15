var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var Agenda = require('agenda');
var Agendash = require('agendash');

var indexRouter = require('./routes/index');
var controlRouter = require('./routes/control');
var cameraRouter = require('./routes/camera');

var app = express();

// setup agenda
const mongoConnectionString = 'mongodb://127.0.0.1/agenda';
const agenda = new Agenda({db: {address: mongoConnectionString, collection: 'agendaJobs'}});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.use('/', indexRouter);
app.use('/schedule', Agendash(agenda, {
  title: 'GardenBot Schedule'
}));
app.use('/control', controlRouter);
app.use('/camera', cameraRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
module.exports.agenda = agenda;
