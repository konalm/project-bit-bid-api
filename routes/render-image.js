var renderImageResponse = require('../services/render-image-response');


/********
  render image response route
 ********/

const renderImageRoute = (router, authRouter) => {
  router.route('/render-item-img/:user_id/item/:item_id/img-path/:img_path')
    .get(renderImageResponse);
}

module.exports = renderImageRoute
