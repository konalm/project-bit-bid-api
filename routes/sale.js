var saleController = require('../controllers/sale');


/*******
  sale routes
 ******/

const salesRoutes = (router, authRouter) => {
  authRouter.route('/sales/:sale_id').get(saleController.getSale);
  authRouter.route('/sales').get(saleController.getSales);
}

module.exports = salesRoutes
