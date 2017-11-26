/**
 * validate bid id greater than last bid
 */
validateBid = (item, amount) => {
  console.log('validate bid')

  currentBid = item.bids.length > 0 ?
    item.bids[0].amount : item.bidStats.startingPrice

  console.log(currentBid)
  console.log(amount)

  if (amount <= currentBid) {
    return false
  }

  return true
}

module.exports = validateBid
