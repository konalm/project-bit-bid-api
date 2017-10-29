/*******
  api routes
 ******/

const apiRoutes = (router, authRouter) => {

  // authRouter.get('/test', function(req, res) {
  //   console.log('reached authorized endpoint !!!');
  //
  // console.log('decoded ----->');
  // console.log(req.decoded);
  // console.log('<------------');
  //
  //   return res.send('reached authorized endpoint !!');
  // });

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
   * render image response route
   */
  require('./render-image')(router, authRouter);
}


module.exports = apiRoutes;
