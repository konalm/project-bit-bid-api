const Item = require('../../../models/itemModel')


/**
 *
 */
getItem = (itemId) => {
  return new Promise((resolve, reject) => {
    Item.findById(itemId)
      .populate('bidStats')
      .populate({
        path: 'bids',
        options: {
          limit: 1,
          sort: { 'amount': -1 }
        }
      })
      .exec((err, item) => {
        if (err) { reject(err.message) }

        resolve(item)
      })
  })
}

module.exports = getItem
