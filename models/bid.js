var mongoose = require('mongoose');

var BidSchema = new mongoose.Schema({
  item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
  bidder: {type: mongoose.Schema.Types.ObjectId, ref: 'Bidder'},
  amount: Number,
  date: String
})

module.exports = mongoose.model('Bid', BidSchema);
