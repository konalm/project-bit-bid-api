var emailValidation = require('./email-validation');


/**
 * create user validation
 */
const createUserValidation = (user) => {
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

module.exports = createUserValidation;
