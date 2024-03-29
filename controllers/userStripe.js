const stripe = require("stripe")("sk_test_XnEKEEpi1xHhhVTqG3wYGMXj");


/**
 * create new stripe customer and update user with newly created details
 */
exports.createStripeCustomer = async function (req, res) {
  if (!req.body.userCardDetails.id) {
    return res.status(403).send('There was an error processing your card');
  }

  const user = req.decoded.user;
  let newStripeDetails = {};

  await stripeApiCreateCustomer(req).then(res => {
    newStripeDetails.stripeCustomerId = res.id;
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
 * update stripe account with debit card (to recieve payments from sales)
 */
exports.updateStripeAccountWithDebit = async function (req, res) {
  const user = req.decoded.user;
  const bankAccountDetails = req.body.bankAccountDetails;

  if (!bankAccountDetails.id) {
    return res.status(401).send('unable to process bank account');
  }

  stripe.accounts.update(user.stripeAccountId,
    {external_account: bankAccountDetails.id},
    function (err, externalAccount) {
      if (err) { return res.status(500).send(err); }

      return res.send(externalAccount);
    }
  )
}

/**
 * get stripe bank accounts belonging to user
 */
exports.getStripeBankAccounts = function (req, res) {
  const user = req.decoded.user;

  stripe.accounts.listExternalAccounts(
    user.stripeAccountId,
    {object: "bank_account"},
    function(err, bankAccounts) {
      if (err) { return res.status(500).send(err); }

      return res.send(bankAccounts);
    }
  );
}

/**
 * create new stripe customer to be associated with user account
 */
function stripeApiCreateCustomer (req) {
  return stripe.customers.create({
    description: 'Customer for johndoe@gmail.com',
    source: req.body.userCardDetails.id
  })
}

/**
 * create stripe account (for recieving payment for sales)
 */
var stripeAPICreateAccount = function (userDetails) {
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
