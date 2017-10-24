var orderController = require ('../controllers/order');
var chargeController = require('../controllers/chargeController');

/**
 * order routes
 */
module.exports.set = function (router, authRouter) {
  console.log('order routes');

  authRouter.route('/orders').get(orderController.getOrders);
  authRouter.route('/orders/:order_id').get(orderController.getOrder);
  authRouter.route('/order-status-update/:order_id')
    .put(orderController.updateOrderStatus);

  authRouter.route('/handle-order-transaction')
    .post(chargeController.handleOrderTransaction);
}
