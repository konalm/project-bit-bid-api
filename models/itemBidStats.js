var mongoose = require('mongoose');

var ItemBidStatsSchema = new mongoose.Schema({
  item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
  bidStartDate: Date,
  bidEndDate: Date,
  startingPrice: Number,
});

module.exports = mongoose.model('ItemBidStats', ItemBidStatsSchema);
