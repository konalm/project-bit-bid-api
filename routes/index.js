/**
 * api routes
 */
module.exports.set = function(router, authRouter) {
  console.log('routes');

  /**
   * item routes
   */
  itemRoutes = require('./item');
  itemRoutes.set(router, authRouter);

  /**
   * user routes
   */
  userRoutes = require('./user');
  userRoutes.set(router, authRouter);

  /**
   * order routes
   */
  orderRoutes = require('./order');
  orderRoutes.set(router, authRouter);

  /**
   * sale routes
   */
  orderRoutes = require('./sale');
  orderRoutes.set(router, authRouter);

  /*
   * render image response route
   */
   renderImageRoute = require('./render-image')
   renderImageRoute.set(router);
}
