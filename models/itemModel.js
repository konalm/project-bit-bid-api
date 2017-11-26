var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
  title: String,
  category: String,
  condition: String,
  description: String,
  listingType: Number,
  deliveryMethod: Number,
  price: Number,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  bidStats: {type: mongoose.Schema.Types.ObjectId, ref: 'ItemBidStats'},
  bids: [{type: mongoose.Schema.Types.ObjectId, ref: 'Bid'}],
  imgCollection: [String],
  sold: Boolean
});

module.exports = mongoose.model('Item', ItemSchema);
