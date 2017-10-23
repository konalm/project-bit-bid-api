const OrderAddressTo = require('../../models/orderAddressTo')

/**
 * create address for the item in order to be delivered to
 */
createOrderAddressTo = async function (order, user) {
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

module.exports = createOrderAddressTo
