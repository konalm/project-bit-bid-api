var Order = require('../models/order');
var Token = require('../models/token');
const User = require('../models/user');


/**
 * get order
 */
exports.getOrder = function(req, res) {
  const user = req.authUser;

  Order.findById(req.params.order_id)
    .populate('item buyer seller')
    .exec(function(err, order)
  {
    if (err) { return res.status(500).send(err); }

    if (order.buyer.id !== user.id) {
      return res.status(406).send(err);
    }

    return res.json(order);
  })
}
