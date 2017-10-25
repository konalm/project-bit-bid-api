const stripe = require("stripe")("sk_test_XnEKEEpi1xHhhVTqG3wYGMXj");


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

module.exports = createStripeAccount;
