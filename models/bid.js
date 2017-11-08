var mongoose = require('mongoose');

var BidSchema = new mongoose.Schema({
  bidder: {type: mongoose.Schema.Types.ObjectId, ref: 'Bidder'},
  item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
  amount: Number,
  date: String
})
