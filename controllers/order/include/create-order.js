const Order = require('../../../models/order');

/**
 * create new order
 */
createOrder = async function(item, user) {
  let order = new Order();

  order.item = item._id;
  order.buyer = user._id;
  order.seller = item.user._id;
  order.status = 0;

  await order.save(function(err, order) {
    if (err) { throw new Error(err); }
  });

  await createOrderAddressTo(order, user);

  return order;
}

module.exports = createOrder
