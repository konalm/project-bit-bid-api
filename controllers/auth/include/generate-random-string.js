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

module.exports = generateRandomString
