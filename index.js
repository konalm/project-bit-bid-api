var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bluebird = require('bluebird');

var router = express.Router();
var authRouter = express.Router();

var allowClientAccess = require('./middleware/cors');
var requireAuth = require('./middleware/auth');

app.use(bodyParser.urlencoded ({extended: true}));
app.use(bodyParser.json ({limit:'50mb'}));

/*
 * Allow client access
 */
app.use(function (req, res, next) {
  res = allowClientAccess(res);
  next();
});

/*
 * Register all routes with /api
 */
app.use('/api', router);
app.use('/api', authRouter);

/*
 * check user in client is authorized
 */
authRouter.use(function (req, res, next) {
  requireAuth(req, res, next);
});

/**
 * connect to mongo database
 */
mongoose.connect('mongodb://localhost/bit_bid_dev');
mongoose.Promise = require('bluebird');

/**
 * api routes
 */
routes = require('./routes');
routes.set(router, authRouter);

/**
 * Start the server
 */
app.listen(8080);
