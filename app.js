const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const colors = require('colors');
const errorHandler = require('./middlewares/error');

const Routes = require('./routes/');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', Routes.MainRoutes);
app.use('/api/v1/users', Routes.UsersRoutes);
app.use('/api/v1/business', Routes.BusinessesRoutes);
app.use('/api/v1/drivers', Routes.DriversRoutes);
app.use('/api/v1/auth', Routes.AuthRoutes);

// error handler
app.use(errorHandler);

module.exports = app;
