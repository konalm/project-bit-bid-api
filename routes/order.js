var orderController = require ('../controllers/order');


/******
  order routes
 ******/

const orderRoutes = (router, authRouter) => {
  authRouter.route('/orders').get(orderController.getOrders);

  authRouter.route('/orders/:order_id').get(orderController.getOrder);

  authRouter.route('/order-status-update/:order_id')
    .put(orderController.updateOrderStatus);

  authRouter.route('/handle-order-transaction')
    .post(orderController.handleOrderTransaction);
}

module.exports = orderRoutes
