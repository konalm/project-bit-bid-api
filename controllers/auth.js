var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');

function allowClientAccess (res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  return res;
}

/**
 * check user login credentials
 */
exports.postLogin = function (req, res) {
  const email = req.body.email;
  const passw = req.body.password;

  User.findOne({ email: email }, function (err, user) {
    if (err) { return res.json({ message: err}) }

    if (!user) {
      return res.json({message: 'no user found'})
    }

    /* username and password match */
    if (user.password === passw) {
      var accessToken = generateRandomString(26);

      var token = new Token({
        value: accessToken,
        userId: user.id
      });

      token.save(function(err) {
        if (err) { res.send(err); }
      });

      return res.json({message: 'MATCH', token: accessToken});
    }

      return res.json({message: 'Incorrect Details'});
  });
};

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
