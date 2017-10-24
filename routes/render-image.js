var renderImageResponse = require('../services/render-image-response');


/**
 * render image response route
 */
module.exports.set = function (router, authRouter) {
  console.log('render image route');

  router.route('/render-item-img/:user_id/item/:item_id/img-path/:img_path')
    .get(renderImageResponse);

}
