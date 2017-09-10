var mongoose = require('mongoose');

var OrderAddressToSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  
  country: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  postcode: {
    type: String,
    required: true
  },

  addressLine: {
    type: String,
    required: true
  },

  addressLine2: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('OrderAddressTo', OrderAddressToSchema);
