const stripe = require("stripe")("sk_test_XnEKEEpi1xHhhVTqG3wYGMXj");

const Item = require('../models/itemModel');
const Token = require('../models/token');
const User = require('../models/user');

exports.placeOrder = function(req, res) {
  console.log('place order !!');

  stripe.charges.create({
    amount: 10000,
    currency: "gbp",
    source: "tok_1AvtktH6QSsRrkgglcIvXBPs",
    description: "test charge for £10.00",
  }, function (err, charge) {
    if (err) { return res.send(err); }

    return res.send(charge);
  });
}

exports.createCustomer = function(req, res) {
  console.log('create customer !!');


}


exports.handleOrderTransaction = function (req, res) {
  let user = {};
  let item = {};

  Token.findOne({value: req.get('Authorization')}, 'userId')
    .then(res => {
        getUser(res.userId);
    })
    .catch(err => {
      return res.status(500).send(err);
    })

  const getUser = (userId) => {
    User.findById(userId)
      .then(res => {
        user = res;

        getItem();
      })
      .catch(err => {
        return res.status(500).send(err);
      })
  }

  const getItem = () => {
    Item.findById(req.body.itemId)
      .then(res => {
        item = res;
        chargeUser();
      })
  }

  const chargeUser = () => {
    /* charge user for the purchased item */
    stripe.charges.create({
      amount: item.price * 100,
      currency: "gbp",
      customer: user.stripeId
    });

    return res.send('item transaction complete');
  }
}
