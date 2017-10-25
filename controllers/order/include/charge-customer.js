const stripe = require("stripe")("sk_test_XnEKEEpi1xHhhVTqG3wYGMXj");


/**
 *
 */
chargeCustomer = function (user, item) {
  return stripe.charges.create({
    amount: item.price * 100,
    currency: "gbp",
    customer: user.stripeCustomerId,
    destination: {
      account: item.user.stripeAccountId
    }
  })
}

module.exports = chargeCustomer
