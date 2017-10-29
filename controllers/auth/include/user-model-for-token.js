const userTokenModel = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    stripeAccountId: user.stripeAccountId
  }
}

module.exports = userTokenModel;
