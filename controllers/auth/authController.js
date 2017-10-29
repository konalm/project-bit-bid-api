const bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken');

const config = require('../../config');

var User = require('../../models/user'),
  Client = require('../../models/client'),
  Token = require('../../models/token');

/**
 * includes
 */
var generateRandomString = require('./include/generate-random-string'),
  createAuthToken = require('./include/create-auth-token'),
  userTokenModel = require('./include/user-model-for-token');

/**
 * compare password user entered to the one in database using bcrypt
 */
exports.postLogin = async function (req, res) {
  const email = req.body.email;
  const passw = req.body.password;

  try {
    var user = await User.findOne({ email: email })
  }
  catch (err) { return res.status(500).send(err); }

  await bcrypt.compare(passw, user.password)
    .then(async (response) => {
      if (!response) {
        return res.status(403).send('email or password is incorrect');
      }

      const payload = { user: userTokenModel(user) };

      try {
        var token = jwt.sign(payload, config.secret, { expiresIn: "2 days" });
      }
      catch (err) { return res.status(500).send(err.message); }

      return res.json({message: 'email and password match', token: token});
    })
    .catch(err => {
      return res.status(500).send(err);
    })
};
