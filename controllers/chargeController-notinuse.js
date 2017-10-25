const stripe = require("stripe")("sk_test_XnEKEEpi1xHhhVTqG3wYGMXj");

const sgMail = require('@sendgrid/mail');

const Item = require('../models/itemModel');
const Token = require('../models/token');
const User = require('../models/user');


const servicePath = '../services/order/';



var chargeCustomer = require(`${servicePath}charge-customer`);
var createOrder = require(`${servicePath}create-order`);

var sendMailNotificationToSeller =
  require(`${servicePath}send-mail-notification-to-seller`);

var createOrderAddressTo =
    require(`${servicePath}create-order-address-to`);



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
