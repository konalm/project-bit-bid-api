var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
  item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
  seller: {type: mongoose.Schema.Types.ObjectId, ref: 'Seller'},
  buyer: {type: mongoose.Schema.Types.ObjectId, ref: 'Buyer'},
  status: Number, default: 0,
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Order', OrderSchema);
