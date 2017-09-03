var mongoose = require('mongoose');

var TestSchema = new mongoose.Schema({
  name: 'colA',
  type: 'string',
  quantity: Number
});

// Export the mongoose model
module.exports = mongoose.model('Test', TestSchema);
