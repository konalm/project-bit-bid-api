var Token = require('../../../models/token');


/**
 * create auth token
 */
const createAuthToken = async function (user) {
  var accessToken = generateRandomString(26);
  var token = new Token({value: accessToken, userId: user.id});

  await token.save(function(err) {
    if (err) { res.status(500).send(err); }
  });

  return accessToken;
}


module.exports = createAuthToken
