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
exports.postLogin = async function (req, res) {
  console.log('auth login !! --> DELTA');

  const email = req.body.email;
  const passw = req.body.password;

  User.findOne({ email: email }, async function (err, user) {
    if (err) { return res.status(500).send(err); }

    if (!user) {
      console.log('no user');
      return res.status(403).send('email or password is incorrect');
    }

    /* username and password match */
    if (user.password === passw) {
      console.log('match');
      const token = await createAuthToken(user);
      console.log('token done');
      return res.json({message: 'MATCH', token: token});
    }

    console.log('no match');
    return res.status(403).send('email or password is incorrect');
  });
};

/**
 * crete auth token
 */
async function createAuthToken (user) {
  console.log('create auth token !!');

  var accessToken = generateRandomString(26);

  var token = new Token({
    value: accessToken,
    userId: user.id
  });

  await token.save(function(err) {
    if (err) { res.status(500).send(err); }
  });

  console.log('auth token saved');

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
