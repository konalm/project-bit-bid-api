var userController = require('../controllers/user')
var userStripeController = require('../controllers/userStripe');
var authController = require('../controllers/auth')


/******
  user routes
 ******/

const userRoutes = (router, authRouter) => {
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
}

module.exports = userRoutes
