var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
  title: String,
  category: String,
  condition: String,
  description: String,
  listedType: Number,
  deliveryMethod: Number,
  price: Number,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  imgCollection: [String],
  sold: Boolean
});

module.exports = mongoose.model('Item', ItemSchema);
