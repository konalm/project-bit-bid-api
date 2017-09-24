var Order = require('../models/order');
const User = require('../models/user');


/**
 * get sale
 */
exports.getSale = function (req, res) {
  const user = req.authUser;

  Order.findById(req.params.sale_id)
    .populate('item buyer seller')
    .exec(function (err, sale)
  {
    if (err) { return res.status(500).send(err); }

    if (sale.seller.id !== user.id) {
      return res.status(406).send('not authorized to access this sale');
    }

    return res.json(sale);
  });
}

/**
 * get all user sales
 */
exports.getSales = function (req, res) {
  const user = req.authUser;

  Order.find({seller: user})
    .populate('item seller')
    .exec(function (err, sales)
  {
    if (err) { return res.status(500).send(err); }

    return res.json(sales);
  });
}
