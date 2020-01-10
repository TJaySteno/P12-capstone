const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const x = true;

const router = require('./routes/router');

require('dotenv').config();

const app = express();

/* view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  const mongoURI = (process.env.NODE_ENV !== 'test') ?
    process.env.MONGODB_URI :
    process.env.MONGODB_URI_TEST;

  mongoose.set('useUnifiedTopology', true);
  mongoose.connect(mongoURI, { useNewUrlParser: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  if (process.env.NODE_ENV !== 'test') {
    db.once('open', () => {
      console.log(('MONGODB connection open'));
      next();
    });
  }
});

app.use(router);

/* catch 404 and forward to error handler */
app.use((req, res, next) => next(createError(404)));

/* error handler */
app.use((err, req, res, next) => {
  /* set locals, only providing error in development */
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /* render the error page */
  res.status(err.status || 500);
  const options = {
    status: res.statusCode,
    message: res.locals.message,
    error: res.locals.err,
    active: [false, false, false],
  };

  console.log(err.stack);

  res.render('error', options);
});

module.exports = app;
