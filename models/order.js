var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
  item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
  seller: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  buyer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  status: Number, default: 0,
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Order', OrderSchema);
