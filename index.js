/**
 * packages
 */
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var multer = require('multer');
var bluebird = require('bluebird');
var mkdirp = require('mkdirp-promise');
var fs = require('fs');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var passport = require('passport');

/**
 * models
 */
var User = require('./models/user');
var Token = require('./models/token');
var ItemImgModel = require('./models/item-images-model');
var Item = require('./models/itemModel');

/**
 * controllers
 */
var userController = require('./controllers/user');
var userStripeController = require('./controllers/userStripe');
var authController = require('./controllers/auth');
var oauth2Controller = require('./controllers/oauth2');
var clientController = require('./controllers/client');
var itemController = require('./controllers/itemController');
var chargeController = require('./controllers/chargeController');
var orderController = require ('./controllers/order');
var saleController = require('./controllers/sale');
var mailController = require('./controllers/mail');

/**
 * middleware
 */
var allowClientAccess = require('./middleware/cors');
var requireAuth = require('./middleware/auth');

/**
 * services
 */
 var renderImageResponse = require('./services/render-image-response');
 var storeItemImg = require('./services/storeItemImg');
 const upload = multer({ storage: storeItemImg });

/**
 * connect to mongo database
 */
mongoose.connect('mongodb://localhost/bit_bid_dev');
mongoose.Promise = require('bluebird');

/**
 * Use the body-parser package
 */
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({extended: true}));

/**
 * Allow client access
 */
app.use(function (req, res, next) {
  res = allowClientAccess(res);
  next();
});

/**
 * Create Express routers
 */
var authRouter = express.Router();
var router = express.Router();

/**
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


/*******
  register routes
*******/

/**
 * user endpoint routes
 */
router.route('/users').post(userController.postUsers);
router.route('/user').get(userController.getUser);

authRouter.route('/user-address')
  .put(userController.updateAddress)
  .get(userController.getUserAddress);

router.route('/user-billing').get(userController.getUserBilling);
router.route('/users-profile/:username').get(userController.getUserForView);

authRouter.route('/create-stripe-customer')
  .post(userStripeController.createStripeCustomer);

authRouter.route('/user-update-stripe-account-debit')
  .post(userStripeController.updateStripeAccountWithDebit);

authRouter.route('/bank-accounts')
  .get(userStripeController.getStripeBankAccounts);

authRouter.route('/logged-in-status').get(userController.userLoggedIn);
router.route('/login').post(authController.postLogin);

/**
 * item endpoint routes
 */
router.route('/items').get(itemController.getItems);
authRouter.route('/items').post(itemController.postItem);

router.route('/items/category/:category_id')
  .get(itemController.getItemsByCategory);

router.route('/items/fuzzy-search/:search_query')
  .get(itemController.getItemsByFuzzySearch);

router.route('/items/category/:category/search/:search_query')
  .get(itemController.getItems);

router.route('/items/:item_id')
  .get(itemController.getItem)

authRouter.route('/items/:item_id')
  .post(upload.any(), itemController.uploadItemImages);

/**
 * charge
 */
authRouter.route('/handle-order-transaction')
  .post(chargeController.handleOrderTransaction);

/**
 * order endpoint routes
 */
authRouter.route('/orders').get(orderController.getOrders);
authRouter.route('/orders/:order_id').get(orderController.getOrder);
authRouter.route('/order-status-update/:order_id')
  .put(orderController.updateOrderStatus);

/**
 * sale endpoint routes
 */
authRouter.route('/sales/:sale_id').get(saleController.getSale);
authRouter.route('/sales').get(saleController.getSales);

/**
 * mail
 */
authRouter.route('/mail-notification-to-seller/:seller_id')
  .get(mailController.sendMailNotificationToSeller);

/**
 * render image response
 */
router.route('/render-item-img/:user_id/item/:item_id/img-path/:img_path')
  .get(renderImageResponse);

/**
 * Start the server
 */
app.listen(8080);
