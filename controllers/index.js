/**
 * declare controllers
 */
module.exports.set = function(app) {
  var userController = require('./user');
  var userStripeController = require('./userStripe');
  var authController = require('./auth');
  var oauth2Controller = require('./oauth2');
  var clientController = require('./client');
  var itemController = require('./item');
  var chargeController = require('./chargeController');
  var orderController = require ('./order');
  var saleController = require('./sale');
  var mailController = require('./mail');
}
