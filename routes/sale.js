var saleController = require('../controllers/sale');

/**
 * sale routes
 */
module.exports.set = function (router, authRouter) {
  console.log('sale routes');

  authRouter.route('/sales/:sale_id').get(saleController.getSale);
  authRouter.route('/sales').get(saleController.getSales);
}
