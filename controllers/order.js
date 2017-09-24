var Order = require('../models/order');
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
      return res.status(406).send('not authorized to access this order');
    }

    return res.json(order);
  })
}

/**
 * get all user orders
 */
exports.getOrders = function(req, res) {
  const user = req.authUser;

  Order.find({buyer: user})
    .populate('item seller')
    .exec(function (err, orders)
  {
    if (err) { return res.status(500).send(err); }

    return res.json(orders);
  });
}

/**
 * update order status
 */
exports.updateOrderStatus = function (req, res) {
  console.log('update order status !!');
  let order = {};

  const status = req.body.status;

  if (!status) {return res.send('No valid status to update');}

  const newOrderStatus = {status: status};

  Order.findById(req.params.order_id).then(order => {
    updateStatus(order);
  })
  .catch(err => { throw new Error(err); })

  const updateStatus = (order) => {
    order.update(newOrderStatus, (err, data) => {
      if (err) { return res.status(500).send(err); }

      return res.json({message: 'order status updated', data: data});
    })
  }
}
