var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
  value: {
    type: String,
    unique: true,
    required: true
  },

  userId: {
    type: String,
    required: true
  }
});


module.exports = mongoose.model('Token', TokenSchema);
