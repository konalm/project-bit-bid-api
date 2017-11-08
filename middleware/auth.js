var jwt = require('jsonwebtoken')
const config = require('../config')

var User = require('../models/user')
var Token = require('../models/token')


/**
 * verify user has an authorized token using the jwt package
 */
const requireAuth = (req, res, next) => {
  if (req.method === 'OPTIONS') { next(); return; }

  var token = req.get('Authorization');

  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.status(406).send('Not Authorized');
      }

      req.decoded = decoded
      next()
    })
  } else {
    return res.status(406).send('Not Authorized');
  }
}

module.exports = requireAuth
