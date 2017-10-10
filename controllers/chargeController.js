const stripe = require("stripe")("sk_test_XnEKEEpi1xHhhVTqG3wYGMXj");

const sgMail = require('@sendgrid/mail');

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

  /* dont allow item to be bought twice */
  if (item.sold) {
    return res.status(403).send('cannot order item that has already been sold');
  }

  await stripeChargeCustomer(user, item).catch(err => {
    return res.status(500).send(err);
  })

  await item.update({sold: 'true'}, (err, data) => {
    if (err) { return res.status(500).send(err); }
  })

  const newOrder = await createOrder(item, user);
  await updateItemToSold(item);

  sendMailNotificationToSeller(newOrder, item, user);

  return res.json({message: 'new order created', data: newOrder});
}

/**
 * charge user using stripe API
 */
function stripeChargeCustomer (user, item) {
  return stripe.charges.create({
    amount: item.price * 100,
    currency: "gbp",
    customer: user.stripeCustomerId,
    destination: {
      account: item.user.stripeAccountId
    }
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
  order.status = 0;

  await order.save(function(err, order) {
    if (err) { throw new Error(err); }
  });

  await createOrderAddressTo(order, user);

  return order;
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

/**
 * send mail notification to seller
 */
function sendMailNotificationToSeller (order, item, user) {
  sgMail.setApiKey('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');

  const email = 'connorlloydmoore@gmail.com';
  /* item.user.email */

  const msg = {
    to: `${email}`,
    from: 'projectbb@gmail.com',
    subject: `New Sale #${order.id}`,
    html: `<strong>Well Done.</strong>
      <br />
      You have sold a new item. ${item.title} for £${item.price}.</strong>
      <br />
      to ${user.username}. Please Disaptch it in the next 48hours. `,
  };

  sgMail.send(msg).catch(err => {
    console.log('ERROR');
    throw new Error(err);
  })
}

/**
 *
 */
exports.createAccount = async function (req, res) {
  stripe.accounts.create({
    type: 'custom',
    country: 'GB',
    email: 'johndoe@gmail.com',
  }, function (err, account) {
    if (err) { throw new Error(err); }

    return res.json(account);
  });
}

exports.updateAccount = async function (res, res) {
  stripe.accounts.update("acct_1B8cU4BeMyBWerYE",
    {external_account: "tok_1B9LAkH6QSsRrkgg2b5wz53j"},
    function (err, externalAccount) {
      if (err) { console.log(err); return res.send(err); }

      console.log(externalAccount);
      return res.send(externalAccount);
  })
}


exports.createBankAccount = async function (req, res) {
  stripe.accounts.createExternalAccount(
    "acct_1B6nyqEPHUwJNcKX",
    {external_account: "card_1B8d7QH6QSsRrkggOpi6vFOB"},
    function (err, bankAccount) {
      if (err) { console.log(err); }

      console.log('bank account ------->');
      console.log(bankAccount);
      return res.json(bankAccount);
    }
  );
}

exports.createCard = async function (req, res) {
  console.log('create card');

  stripe.tokens.create({
    card: {
      "number": '4242424242424242',
      "exp_month": 12,
      "exp_year": 2018,
      "cvc": '123',
      "currency": 'usd'
    }
  }, function(err, token) {
    if (err) {
      console.log('ERROR');
      console.log(err);
    }

    console.log('card token response ---->');
    console.log(token);

    return res.send(token);
  })
}

exports.createSource = async function (req, res) {
  console.log('create source');

  stripe.customers.createSource(
    "cus_BSypoSWL4WgCZn",
    { source: "tok_1B7Wy7H6QSsRrkgg9Kqqre5N" },
    function (err, card) {
      console.log('source ---->');
      console.log(card);

      return res.send(card);
    }
  );
}

exports.createPayout = async function (req, res) {
  console.log('create payout');

  stripe.payouts.create({
    amount: 400,
    currency: "usd",
    destination: "card_1B7Wy7H6QSsRrkggr6RVTnWB"
  }, function(err, payout) {
    if (err) { return res.send(err); }

    console.log('payout ----->');
    console.log(payout);

    return res.send(payout);
  });

  return;
}

exports.transferPayout = async function (req, res) {
  console.log('transfer payout');

  stripe.transfers.create({
    amount: 1000,
    currency: "gbp",
    destination: "acct_1B7vfcEvjz1MkALP"
    },
    {stripe_account: "acct_1B7vpUJiO6BvSWL2"}
  );
}

exports.charge = async function (req, res) {
  console.log('charge !!');

  stripe.charges.create({
    amount: 2000,
    currency: "gbp",
    customer: "cus_BU8OuaHrZMcgO2",
    destination: {
      account: "acct_1B8cU4BeMyBWerYE"
    }
  }).then(function(charge) {
    console.log('charge res -->');
    console.log(charge);
    return res.send(charge);
  }).catch(err => {
    console.log('ERROR -->');
    console.log(err);
    return res.status(500).send(err);
  });
}
