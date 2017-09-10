var Order = require('../models/order');
var Token = require('../models/token');
const User = require('../models/user');

exports.getOrders = function(req, res) {
  console.log('get orders !!');

  Order.find({'buyer': }, function (err, orders) {
    if (err) { return res.status(500).send(err); }

    res.send(orders);
  });
}

/**
 * get order
 */
exports.getOrder = function(req, res) {
  console.log('get order !!');

  Order.findById(req.params.order_id)
    .populate('item', 'seller', 'buyer')
    .exec(function(err, order)
  {
    if (err) { res.status(500).send(err); }

    return res.json(order);
  }

}
