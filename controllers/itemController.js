var Item = require('../models/itemModel');
var User = require('../models/user');
var Token = require('../models/token');


/**
 * save new item
 */
exports.postItem = function(req, res, next) {
  var item = new Item();

  item.title = req.body.title;
  item.category = req.body.category;
  item.condition = req.body.condition;
  item.description = req.body.description;
  item.sellMethod = req.body.sellMethod;
  item.deliveryMethod = req.body.deliveryMethod;
  item.price = req.body.price;

  const authToken = req.get('Authorization');

  Token.findOne({value: authToken}, 'userId').exec()

  .then(res => {
    return User.findById(res.userId).exec()
  })

  .then(res => {
    item.user = res;
    return item.save()
  })

  .then(item => {
    res.json({message: 'new item has been added', data: item});
    console.log('saved item !!');
  })
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

  if (searchQuery !== 'default') {
    querys = Object.assign(
      querys,
      { $or:[ {'title': regex}, {'description': regex} ]}
    );
  }

  Item.find(querys).populate('user').exec(function(err, items) {
    if (err) { res.send(err); }

    res.json(items);
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
