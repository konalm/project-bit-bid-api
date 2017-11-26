const Bid = require('../../../models/bid')

/**
 * create new bid model and save it
 */
createNewBid = (amount, item, user) => {
  return new Promise ((resolve, reject) => {
    const bid = new Bid({
      amount: amount,
      date: new Date(),
      item: item._id,
      bidder: user.id
    })

    bid.save((err) => {
      if (err) { reject(err.message) }

      resolve(bid)
    })
  })
}

module.exports = createNewBid
