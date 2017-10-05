const stripe = require("stripe")("sk_test_XnEKEEpi1xHhhVTqG3wYGMXj");

var User = require('../models/user');
var Token = require('../models/token');


/**
 * create new user
 */
exports.postUsers = async function(req, res) {
  try {
    var stripeAccount = await createStripeAccount(req.body);
  }
  catch (err) { throw new Error(err); }

  var user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    stripeAccountId: stripeAccount.id
  });

  await user.save(err => {
    if (err) { return res.status(406).send(err); }
  });

  var token = new Token({
    value: generateRandomString(26),
    userId: user.id
  });

  token.save(err =>  {
    if (err) { return res.status(406).send(err); }
  });

  return res.json({ message: 'new user account created' });
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
  Token.findOne({value: req.get('Authorization')}, 'userId').exec()

  .then(response => {
    return User.findById(response.userId).exec()
  })
  .then(user => {
    res.send(user);
  })
  .catch(err => {
    res.send(err);
  })
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
  const user = req.authUser;

  const newUserAddress = req.body.address ?
    req.body.address
    :
    {
      addressLine: req.body.addressLine,
      addressLine2: req.body.addressLine2,
      country: req.body.country,
      city: req.body.city,
      postcode: req.body.postcode
    }

  /* validation */
  const validation = updateAddressValidation(newUserAddress);

  if (validation) {
    return res.status(422).send(validation);
  }

  user.update(newUserAddress, (err, data) => {
    if (err) { res.status(500).send(err); return; }

    return res.send('user address updated');
  })
}

/**
 * validate user address update
 */
function updateAddressValidation (newUserAddress) {
  if (!newUserAddress.addressLine) {
    return 'You must enter an Address line';
  }

  if (!newUserAddress.country) {
    return 'You must enter a Country';
  }

  if (!newUserAddress.city) {
    return 'You must enter a City';
  }

  if (!newUserAddress.postcode) {
    return 'You must enter a Postcode';
  }

  return false;
}

/**
 * create new stripe customer and update user with newly created details
 */
exports.updateStripe = async function (req, res) {
  const user = req.authUser;
  let newStripeDetails = {};

  await stripeCreateCustomer(req).then(res => {
    newStripeDetails.stripeId = res.id;
    newStripeDetails.cardLastFour = res.sources.data[0].last4;
  })
  .catch(err => {
    return res.status(500).send(err);
  });

  user.update(newStripeDetails, (err, data) => {
    if (err) { return res.status(500).send(err); }

    return res.send('user card details updated');
  });
}

/**
 * create stripe account (for recieving payment for sales)
 */
var createStripeAccount = function (userDetails) {
  const email = 'johndoe@gmail.com'
  const countryCode = 'gb';

  return new Promise((resolve, reject) => {
    stripe.account.create({
      type: 'custom',
      country: countryCode,
      email: email
    }, function (err, account) {
      if (err) { reject(err); }

      resolve(account);
    });
  });
}

/**
 * create new stripe customer to be associated with user account
 */
function stripeCreateCustomer (req) {
  return stripe.customers.create({
    description: 'Customer for johndoe@gmail.com',
    source: req.body.userCardDetails.id
  })
}
