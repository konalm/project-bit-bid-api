var ItemBidStats = require('../../../models/itemBidStats');

/**
 * create new item bid stats model
 */
createItemBidStats = async function (_item, newItem) {
  return new Promise ((resolve, reject) => {
    let itemBidStats = new ItemBidStats()

    var endDate = new Date()
    endDate.setDate(endDate.getDate() + parseInt(_item.bidDuration) || 0)

    itemBidStats.item = newItem.id
    itemBidStats.bidStartDate = new Date()
    itemBidStats.bidEndDate = endDate
    itemBidStats.startingPrice = _item.bidStartingPrice

    itemBidStats.save((err) => {
      if (err) { reject(err) }

      resolve(itemBidStats)
    })
  })
}

module.exports = createItemBidStats
