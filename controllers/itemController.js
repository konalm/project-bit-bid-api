var Item = require('../models/itemModel');
var User = require('../models/user');
var Token = require('../models/token');


/**
 * save new item
 */
exports.postItem = function(req, res, next) {
  let user = req.authUser;
  var item = new Item();

  const itemValidation = newItemValidation(req.body);

  if (!itemValidation.status) {
    return res.status(403).send(itemValidation.message);
  }

  item.title = req.body.title;
  item.category = req.body.category;
  item.condition = req.body.condition;
  item.description = req.body.description;
  item.sellMethod = req.body.sellMethod;
  item.deliveryMethod = req.body.deliveryMethod;
  item.price = req.body.price;
  item.sold = false;
  item.user = req.authUser;
  item.save();

  res.json({message: 'new item has been added', data: item});
}

/**
 * upload item images
 */
exports.uploadItemImages = function(req, res, next) {
  res.json({message: 'item images uploaded'});
}

/**
 * get items dependant on category and search query
 */
exports.getItems = function(req, res) {
  let querys = {};

  const category = req.params.category;
  const searchQuery = req.params.search_query;
  const regex = new RegExp(searchQuery, 'i');

  if (category !== 'default') {
    querys.category = category;
  }

  querys.sold = false;

  if (searchQuery !== 'default') {
    querys = Object.assign(
      querys,
      { $or:[ {'title': regex}, {'description': regex} ]}
    );
  }

  Item.find(querys).populate('user').exec(function(err, items) {
    if (err) { res.status(500).send(err); }

    return  res.json(items);
  });
}

/**
 * get items by category
 */
exports.getItemsByCategory = function(req, res) {
  Item.find({category: req.params.category_id}, function(err, items) {
    if (err) { res.send(err); }

    res.json(items);
  });
}

/**
 * get item
 */
exports.getItem = function(req, res) {
  Item.findById(req.params.item_id).populate('user').exec(function(err, item) {
    if (err) { res.send(err); }

    res.json(item);
  });
}

/**
 * search for items that match expression
 */
exports.getItemsByFuzzySearch = function(req, res) {
  const searchQuery = req.params.search_query;
  const regex = new RegExp(searchQuery, 'i');

  Item.find({ $or:[ {'title': regex}, {'description': regex} ]},
    function(err, items)
  {
    if (err) { res.send(err); }

    res.json(items);
  });
}

/**
 * validate new item data
 */
const newItemValidation = function (itemData) {
  console.log('new item validation');
  console.log(itemData);

  if (!itemData.title) {
    return {status: false, message: 'descriptive title is required'}
  }

  if (!itemData.category) {
    return {status: false, message: 'category is required'}
  }

  if (!itemData.condition) {
    return {status: false, message: 'condition is required'}
  }

  if (!itemData.description) {
    return {status: false, message: 'description is required'}
  }

  if (!itemData.sellMethod) {
    return {status: false, message: 'sell method is required'}
  }

  if (!itemData.deliveryMethod) {
    return {status: false, message: 'delivery method is required'}
  }

  if (!itemData.price) {
    return {status: false, message: 'price is required'}
  }

  if (!itemData.uploadedImagesLength > 0) {
    return {status: false, message: 'at least one photo required'}
  }

  if (itemData.description.length < 20) {
    return {
      status: false,
      message: 'at least 20 characters required for description'
    }
  }

  return {status: true, message: 'item passed validation'};
}
