var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  addressLine: {
    type: String,
    required: false,
  },

  addressLine2: {
    type: String,
    required: false,
  },

  country: {
    type: String,
    required: false,
  },

  city: {
    type: String,
    required: false,
  },

  postcode: {
    type: String,
    required: false
  },

  stripeCustomerId: {
    type: String,
    required: false
  },

  stripeAccountId: {
    type: String,
    required: false
  },

  cardLastFour: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model('User', UserSchema);
