const Item = require('../../models/itemModel')
const Bid = require('../../models/bid')

const getItem = require('./include/getItem')
const validateBid = require('./include/bidValidation')
const createNewBid = require('./include/createNewBid')
const addBidToItem = require('./include/addBidToItem')


/**
 * validate bid then save new bid model and add bid model to item bids array
 */
exports.createBid = async (req, res) => {
  /* get item */
  try {
    var item = await getItem(req.body.item)
  }
  catch(err) {
    return res.status(500).send(err)
  }

  /* validate bid */
  if (!validateBid(item, req.body.amount)) {
    return res.status(403).send('bid must be greater than latest bid')
  }

  /* create bid */
  try {
    var bid = await createNewBid(req.body.amount, item, req.decoded.user)
  }
  catch(err) {
    return res.status(500).send(`"create bid error" ${err.message}`)
  }

  /* add bid to items */
  try {
    await addBidToItem(bid, item)
  }
  catch(err) {
    return res.status(500).send(`"add bid to items error" ${err.message}`)
  }

  return res.json({message: 'new bid saved',  bid: bid, item: item})
}
