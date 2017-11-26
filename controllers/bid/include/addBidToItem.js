const Item = require('../../../models/itemModel')
const Bid = require('../../../models/bid')

/**
 * find item by its item id and then add new bid model to its array of bids
 */
addBidToItem = (bid, item) => {
  return new Promise((resolve, reject) => {
    item.bids.push(bid)

    item.save((err) => {
      if (err) { reject(err) }
      
      resolve(item)
    })
  })
}


module.exports = addBidToItem
