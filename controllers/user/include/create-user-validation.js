var User = require('../../../models/user');
var emailValidation = require('./email-validation');


/**
 * validate user input from client
 * validate username is unique
 * validate email is unique
 */
const createUserValidation = async (user) => {
  const inputValidation = clientInputValidation(user);

  if (!inputValidation.status) {
    return {status: false, message: inputValidation.message}
  }

  /* check username is unique */
  try {
    if (await checkUsernameIsUnique(user.username)) {
      return {status: false, message: 'username is already in use'}
    }
  }
  catch (err) {
    return {status: false, message: 'internal server error'}
  }

  /* check email is uique */
  try {
    if (await checkEmailIsUnique(user.email)) {
      return {status: false, message: 'email is already in use'}
    }
  }
  catch (err) {
    return {status: false, message: 'internal server error'}
  }

  return {status: true, message: 'passed validation'};
}


/**
 * create user validation
 */
const clientInputValidation = (user) => {
  if (!user.username) {
    return {status: false, message: 'username required'}
  }

  if (user.username.length < 3) {
    return {status: false, message: 'username must me at leat 3 characters'}
  }

  if (!user.email) {
    return {status: false, message: 'email address is required'}
  }

  if (!emailValidation(user.email)) {
    return {status: false, message: 'invalid email address'}
  }

  if (!user.password) {
    return {status: false, message: 'password is required'}
  }

  if (user.password.length < 6) {
    return {status: false, message: 'password must at least 6 characters'}
  }

  return {status: true, message: 'passed validation'};
}


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

module.exports = createUserValidation;
