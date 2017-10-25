var User = require('../models/user');
var Token = require('../models/token');

/**
 * Look for Token sent by client in the database
 * If token does not exist return 406,
 * If does exist check if user has token, If Not return 406
 */
const requireAuth = (req, res, next) => {
  if (req.method === 'OPTIONS') { next(); return; }

  Token.findOne({value: req.get('Authorization')}, 'userId').then(res => {
      getUser(res.userId)
    })
    .catch(err => { return res.status(406).send('Not authorized') })

  const getUser = (userId) => {
    User.findById(userId).then(user => {
      req.authUser = user
      next()
    })
    .catch(err => {
      return res.status(406).send('Not authorized')
    })
  }
}

module.exports = requireAuth
