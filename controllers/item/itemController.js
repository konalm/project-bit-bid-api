var Item = require('../../models/itemModel');
var User = require('../../models/user');
var Token = require('../../models/token');

var servicePath = '../../services/item/';

/**
 * includes
 */
var newItemValidation = require(`./include/new-item-validation`)
var buildSearchQuery = require(`./include/build-search-query`)
var saveNewItem = require(`./include/save-item-model`)
var saveNewItemBidStats = require('./include/save-item-bid-model')

/**
 * save new item
 * then save bid stats item if item is selling via auction
 */
exports.postItem = async function(req, res) {
  let newItem = {};
  let newItemBidStats = {};

  const itemValidation = newItemValidation(req.body)

  if (!itemValidation.status) {
    return res.status(403).send(itemValidation.message)
  }

  await saveNewItem(req.body, req.decoded.user)
    .then(res => { newItem = res })
    .catch(err => { return res.status(500).send(err) })

  if (req.body.sellMethod === 2) {
    try {
      newItemBidStats = await saveNewItemBidStats(req.body, newItem)
    }
    catch (err) { return res.status(500).send(err.message) }
  }

  return res.json({
    message: 'new item has been added',
    item: newItem,
    itemBidStats: newItemBidStats
  });
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
  let querys = buildSearchQuery(req);

  const perPageLimit = req.query.limit ? parseInt(req.query.limit) : 10;
  const pageNo = req.query.pageno ? parseInt(req.query.pageno) : 1;

  console.log('per page limit -->');
  console.log(perPageLimit);

  console.log('page no -->');
  console.log(pageNo);

  Item.find(querys)
    .populate('user')
    .limit(perPageLimit)
    .skip(perPageLimit * (pageNo - 1))
    .exec(function(err, items)
  {
    if (err) {
      return res.status(500).send(err);
    }

    return res.json(items);
  });
}

/**
 * count items (usually for pagination)
 */
exports.countItems = function(req, res) {
  let querys = buildSearchQuery(req);

  Item.count(querys, function (err, count) {
    if (err) {
      res.status(500).send(err);
    }

    return res.json(count);
  })
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
