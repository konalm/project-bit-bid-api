var mongoose = require('mongoose');

var ItemBidStatsSchema = new mongoose.Schema({
  bidStartDate: Date,
  bidEndDate: Date,
  startingPrice: Number,
});

module.exports = mongoose.model('ItemBidStats', ItemBidStatsSchema);
