const stripe = require("stripe")("sk_test_XnEKEEpi1xHhhVTqG3wYGMXj");

var User = require('../models/user');
var Token = require('../models/token');


/**
 * CREATE USER
 * check user entered valid data
 * check username and email is unique
 * create stripe account
 * create user
 */
exports.postUsers = async function(req, res) {
  const validation = createUserValidation(req.body);

  if (!validation.status)
    { return res.status(403).send(validation.message); }

  await checkUsernameIsUnique(req.body.username).then(response => {
    if (response)
      { return res.status(403).send('username is already in use'); }
  })
  .catch(err => { return res.status(500).send(err); })

  await checkEmailIsUnique(req.body.email).then(response => {
    if (response) {
      return res.status(403).send('email is already in use');
    }
  })
  .catch(err => {
    return res.status(500).send(err);
  })

  try {
    var stripeAccount = await createStripeAccount(req.body);
  }
  catch (err) { return res.status(500).send(err); }

  var user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    stripeAccountId: stripeAccount.id,
    country: req.body.countryCode
  });

  await user.save(err => {
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
 * create user validation
 */
function createUserValidation (user) {
  if (!user.username) {
    return {status: false, message: 'username required'}
  }

  if (user.username.length < 3) {
    return {status: false, message: 'username must me at leat 3 characters'}
  }

  if (!user.email) {
    return {status: false, message: 'email address is required'}
  }

  if (!emailValidation(user.email)) {
    return {status: false, message: 'invalid email address'}
  }

  if (!user.password) {
    return {status: false, message: 'password is required'}

  }

  if (user.password.length < 6) {
    return {status: false, message: 'password must at least 6 characters'}
  }

  return {status: true, message: 'passed validation'};
}

/**
 * validate email address with regex
 */
function emailValidation (email) {
  var regex = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$');

  return regex.test(email);
}

/**
 * create stripe account (for recieving payment for sales)
 */
var createStripeAccount = function (userDetails) {
  return new Promise((resolve, reject) => {
    stripe.account.create({
      type: 'custom',
      country: userDetails.countryCode,
      email: userDetails.email
    }, function (err, account) {
      if (err) { reject(err); }

      resolve(account);
    });
  });
}

/**
 * check username is unique
 */
var checkUsernameIsUnique = function (username) {
  return new Promise((resolve, reject) => {
    User.findOne({username: username }, 'username').then(res => {
      resolve(res);
    })
    .catch(err => { reject(err); })
  })
}

/**
 * check email is uniquer
 */
var checkEmailIsUnique = function (email) {
  return new Promise((resolve, reject) => {
    User.findOne({email: email}, 'email').then(res => {
      resolve(res);
    })
    .catch(err => { reject(err); })
  })
}

/**
 * address validation
 */
function addressValidation (address) {
  if (!address.addressLine) {
    return {status: false, message: 'address line is required'}
  }

  if (!address.city) {
    return {status: false, message: 'city is required'}
  }

  if (!address.postcode) {
    return {status: false, message: 'postcode is requried'}
  }

  return {status: true, message: 'passed validation'}
}
