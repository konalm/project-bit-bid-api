var Item = require('../../../models/itemModel');

/**
 * create new item model
 */
createItem = async function (_item, user, itemBidStats) {
  return new Promise ((resolve, reject) => {
    let item = new Item();

    item.title = _item.title;
    item.category = _item.category;
    item.condition = _item.condition;
    item.description = _item.description;
    item.listingType = _item.sellMethod;
    item.deliveryMethod = _item.deliveryMethod;
    item.price = _item.price;
    item.sold = false;
    item.user = user.id;

    if (_item.sellMethod == 2) {
      item.bidStats = itemBidStats._id
    }

    item.save((err) => {
      console.log('create item done');

      if (err) { reject(err) }
      resolve(item)
    })
  })
}

module.exports = createItem
