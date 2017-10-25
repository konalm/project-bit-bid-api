var User = require('../../models/user'),
  Client = require('../../models/client'),
  Token = require('../../models/token');

/**
 * includes
 */
var generateRandomString = require('./include/generate-random-string'),
  createAuthToken = require('./include/create-auth-token');

/**
 * check user login credentials
 */
exports.postLogin = async function (req, res) {
  const email = req.body.email;
  const passw = req.body.password;

  User.findOne({ email: email }, async function (err, user) {
    if (err) { return res.status(500).send(err); }

    if (!user) { return res.status(403).send('email or password is incorrect'); }

    /* username and password match */
    if (user.password === passw) {
      const token = await createAuthToken(user);
      return res.json({message: 'email and password match', token: token});
    }

    return res.status(403).send('email or password is incorrect');
  });
};
