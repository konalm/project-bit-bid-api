const stripe = require("stripe")("sk_test_XnEKEEpi1xHhhVTqG3wYGMXj");

const Item = require('../models/itemModel');
const Token = require('../models/token');
const User = require('../models/user');
const Order = require('../models/order');


/**
 * charge user for purchase and create record of the transaction
 */
exports.handleOrderTransaction = async function (req, res) {
  console.log('handle order transaction !!');

  let user = req.authUser;
  let item = {};

  await Item.findById(req.body.itemId, (err, data) => {
    if (err) { return res.status(500).send(err); }

    item = data;
  })

  console.log('item --->');
  console.log(item);

  await stripeChargeCustomer(user, item).catch(err => {
    console.log(err);
    return res.status(500).send(err);
  })

  console.log('charged stripe customer');

  await item.update({sold: 'true'}, (err, data) => {
    if (err) { return res.status(500).send(err); }
  })

  await createOrder(item, user);
  res.send('new order created');
}

/**
 * charge user using stripe API
 */
function stripeChargeCustomer (user, item) {
  console.log('stripe charge customer -->');
  console.log(item.price * 100);

  return stripe.charges.create({
    amount: item.price * 100,
    currency: "gbp",
    customer: user.stripeId
  })
}

/**
 * create new order in the DB
 */
function createOrder (item, user) {
  let order = new Order();
  order.item = item;
  order.buyer = user._id;
  order.seller = item.user;

  order.save(function(err, order) {
    if (err) { return res.send(err); }

    return;
  });
}
