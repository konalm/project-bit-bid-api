const stripe = require("stripe")("sk_test_XnEKEEpi1xHhhVTqG3wYGMXj"),
  bcrypt = require('bcrypt');

const User = require('../../models/user'),
  Token = require('../../models/token');

/**
 * includes
 */
const addressValidation = require('./include/address-validation'),
  createStripeAccount = require('./include/create-stripe-account'),
  emailValidation = require('./include/email-validation'),
  createUserValidation = require('./include/create-user-validation'),
  updateAddressValidation = require('./include/update-address-validation')
  createUserModel = require('./include/create-user-model');


/**
 * create user
 */
exports.postUsers = async function(req, res) {
  const validation = await createUserValidation(req.body);

  if (!validation.status) { return res.status(403).send(validation.message); }

  /* create stripe account for user */
  try {
    var stripeAccount = await createStripeAccount(req.body);
  }
  catch (err) { return res.status(500).send(err); }

  /* create user model */
  try {
    var user = await createUserModel(req.body, stripeAccount);
  }
  catch (err) { return res.status(500).send(err); }

  await user.save(err => {
    if (err) { return res.status(406).send(err); }
  });

  return res.json({
    message: 'new user account created',
    data: user
  });
};

/**
 * get user for view by another user
 */
exports.getUserForView = function (req, res) {
  User.findOne({username: req.params.username}, function(err, user) {
    if (err) { res.send(err); }

    res.send(user);
  });
};

/**
 * get user
 */
exports.getUser = function (req, res) {

  const user = req.decoded.user;

  return res.send(user);
}

/**
 * get user address
 */
exports.getUserAddress = function (req, res) {
  Token.findOne({value: req.get('Authorization')}, 'userId').exec()

  .then(response => {
    return User.findById(response.userId)
      .select('addressLine addressLine2 country city postcode')
      .exec()
  })
  .then(user => {
    res.send(user);
  })
  .catch(err => {
    res.send(err);
  })
}

/**
 * get user billing details
 */
exports.getUserBilling = function (req, res) {
  Token.findOne({value: req.get('Authorization')}, 'userId')
    .then(res => {
      getUser(res.userId);
    })
    .catch(err => {
      res.status(500).send(err);
    })

  const getUser = (userId) => {
    User.findById(userId)
      .select('stripeId cardLastFour')
      .then(user => {
        return res.send(user);
      })
      .catch(err => {
        return res.status(500).send(err);
      })
  }
}

/**
 * update user address
 */
exports.updateAddress = function (req, res) {
  const user = req.decoded.user;
  const validation = addressValidation(req.body);

  if (!validation.status) {
    return res.status(403).send(validation.message);
  }

  const newUserAddress = req.body.address ?
    req.body.address :
    {
      addressLine: req.body.addressLine,
      addressLine2: req.body.addressLine2,
      country: req.body.country,
      city: req.body.city,
      postcode: req.body.postcode
    }

  user.update(newUserAddress, (err, data) => {
    if (err) { res.status(500).send(err); return; }

    return res.send('user address updated');
  })
}

/**
 * check user is logged in
 * if passed middleware then user is logged in
 */
exports.userLoggedIn = function (req, res) {
  return res.status(200).send(true);
}
