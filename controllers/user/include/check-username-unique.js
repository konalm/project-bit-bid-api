var User = require('../../../models/user');

/**
 * check username is unique
 */
var checkUsernameIsUnique = (username) => {
  return new Promise((resolve, reject) => {
    User.findOne({username: username }, 'username')
      .then(res => {
        resolve(res);
      })
      .catch(err => { reject(err); })
  })
}

module.exports = checkUsernameIsUnique;
