var mongoose = require('mongoose');

var ItemImageSchema = new mongoose.Schema({
  imgPath: String,
  item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'}
});

module.exports = mongoose.model('ItemImages', ItemImageSchema);
