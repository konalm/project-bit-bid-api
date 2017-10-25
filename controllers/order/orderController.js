const Order = require('../../models/order'),
  OrderAddressTo = require('../../models/orderAddressTo'),
  User = require('../../models/user'),
  Token = require('../../models/token'),
  Item = require('../../models/itemModel');

const stripe = require("stripe")("sk_test_XnEKEEpi1xHhhVTqG3wYGMXj");
const sgMail = require('@sendgrid/mail');

/**
 * includes
 */
var chargeCustomer = require(`./include/charge-customer`),
  createOrder = require(`./include/create-order`),
  sendMailNotificationToSeller = require(`./include/send-mail-notification-to-seller`),
  createOrderAddressTo = require(`./include/create-order-address-to`);



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

/**
 * charge user for purchase and create record of the transaction
 */
exports.handleOrderTransaction = async function (req, res) {
  let user = req.authUser;
  let item = {};

  /* find item being ordered */
  await Item.findById(req.body.itemId)
    .populate('user')
    .exec(function(err, data)
  {
    if (err) { return res.status(500).send(err); }
    item = data;
  })

  /* dont allow item to be bought twice */
  if (item.sold) {
    return res.status(403).send('cannot order item that has already been sold');
  }

  await chargeCustomer(user, item).catch(err => {
    return res.status(500).send(err);
  })

  /* update item to sold */
  await item.update({sold: 'true'}, (err, data) => {
    if (err) { return res.status(500).send(err); }
  })

  const newOrder = await createOrder(item, user);
  sendMailNotificationToSeller(newOrder, item, user);

  return res.json({message: 'new order created', data: newOrder});
}
