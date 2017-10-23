var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');

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

/**
 * crete auth token
 */
async function createAuthToken (user) {
  var accessToken = generateRandomString(26);
  var token = new Token({value: accessToken, userId: user.id});

  await token.save(function(err) {
    if (err) { res.status(500).send(err); }
  });

  return accessToken;
}


/**
 * generate random string  (usually used for generating tokens)
 */
generateRandomString = function (length) {
  var text = '';
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += characters.charAt(Math.floor(Math.random() * characters.length));

  return text;
}
