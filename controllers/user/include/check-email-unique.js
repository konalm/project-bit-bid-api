var User = require('../../../models/user');


/**
 * check email is unique
 */
const checkEmailIsUnique = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({email: email}, 'email').then(res => {
      resolve(res);
    })
    .catch(err => { reject(err); })
  })
}

module.exports = checkEmailIsUnique;
