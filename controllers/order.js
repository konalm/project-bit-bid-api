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
