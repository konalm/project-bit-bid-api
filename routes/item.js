var multer = require('multer'),
  storeItemImg = require('../services/storeItemImg'),
  upload = multer({ storage: storeItemImg });

var itemController = require('../controllers/item');


/*****
  item routes
 *****/

const itemRoutes = (router, authRouter) => {
  router.route('/items').get(itemController.getItems);

  authRouter.route('/items').post(itemController.postItem);

  router.route('/items/category/:category_id')
    .get(itemController.getItemsByCategory);

  router.route('/items/fuzzy-search/:search_query')
    .get(itemController.getItemsByFuzzySearch);

  router.route('/items/category/:category/search/:search_query')
    .get(itemController.getItems);

  router.route('/items-count/:category/search/:search_query')
    .get(itemController.countItems);

  router.route('/items/:item_id').get(itemController.getItem)

  authRouter.route('/items/:item_id')
    .post(upload.any(), itemController.uploadItemImages);
}

module.exports = itemRoutes
