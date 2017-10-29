const bcrypt = require('bcrypt');
var User = require('../../../models/user');


/**
 * hash password with bcrpyt algo
 * create user model
 */
const createUserModel = async (user, stripeAccount) => {
  try {
    var hashedPassword = await bcrypt.hash(user.password, 10);
  }
  catch (err) {throw new Error(err); }

  var user = new User({
    username: user.username,
    email: user.email,
    password: hashedPassword,
    stripeAccountId: stripeAccount.id,
    country: user.countryCode
  });

  return user;
}

module.exports = createUserModel;
