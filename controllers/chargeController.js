const stripe = require("stripe")("sk_test_XnEKEEpi1xHhhVTqG3wYGMXj");

const Item = require('../models/itemModel');
const Token = require('../models/token');
const User = require('../models/user');
const Order = require('../models/order');
const OrderAddressTo = require('../models/orderAddressTo')


/**
 * charge user for purchase and create record of the transaction
 */
exports.handleOrderTransaction = async function (req, res) {
  let user = req.authUser;
  let item = {};

  await Item.findById(req.body.itemId)
    .populate('user')
    .exec(function(err, data)
  {
    if (err) { return res.status(500).send(err); }

    item = data;
  })

  await stripeChargeCustomer(user, item).catch(err => {
    return res.status(500).send(err);
  })

  await item.update({sold: 'true'}, (err, data) => {
    if (err) { return res.status(500).send(err); }
  })

  await createOrder(item, user);
  await updateItemToSold(item);

  res.send('new order created');
}

/**
 * charge user using stripe API
 */
function stripeChargeCustomer (user, item) {
  console.log('stripe charge customer');

  return stripe.charges.create({
    amount: item.price * 100,
    currency: "gbp",
    customer: user.stripeId
  })
}

/**
 * create new order
 */
async function createOrder (item, user) {
  let order = new Order();
  order.item = item._id;
  order.buyer = user._id;
  order.seller = item.user._id;

  await order.save(function(err, order) {
    if (err) { throw new Error(err); }
  });

  await createOrderAddressTo(order, user);
}

/**
 * create address for the item in order to be delivered to
 */
async function createOrderAddressTo (order, user) {
  let orderAddressTo = new OrderAddressTo();

  orderAddressTo.orderId = order._id;
  orderAddressTo.country = user.country;
  orderAddressTo.city = user.city;
  orderAddressTo.postcode = user.postcode;
  orderAddressTo.addressLine = user.addressLine;
  orderAddressTo.addressLine2 = user.addressLine2;

  await orderAddressTo.save(function(err, data) {
    if (err) { throw new Error(err); }
  })
}

/**
 * update item to sold
 */
function updateItemToSold (item) {
  item.update({sold: true}, (err, data) => {
    if (err) { throw new Error (err); }
  });
}
