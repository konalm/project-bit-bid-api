/*******
  api routes
 ******/

const apiRoutes = (router, authRouter) => {
  /**
   * item routes
   */
   require('./item')(router, authRouter);

  /**
   * user routes
   */
  require('./user')(router, authRouter);

  /**
   * order routes
   */
  require('./order')(router, authRouter);

  /**
   * sale routes
   */
  require('./sale')(router, authRouter);

  /**
   * bid routes
   */
  require('./bid')(router, authRouter);

  /**
   * render image response route
   */
  require('./render-image')(router, authRouter);
}


module.exports = apiRoutes;
