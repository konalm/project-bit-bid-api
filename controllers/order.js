var Order = require('../models/order');
var Token = require('../models/token');
const User = require('../models/user');


/**
 * get order
 */
exports.getOrder = function(req, res) {
  console.log('get order !!');

  const user = req.authUser;

  Order.findById(req.params.order_id)
    .populate('item buyer seller')
    .exec(function(err, order)
  {
    if (err) { return res.status(500).send(err); }

    if (order.buyer.id !== user.id) {
      console.log('not buyer !!');
      return res.status(406).send(err);
    }

    console.log('return order');
    return res.json(order);
  })
}
