var bidController = require('../controllers/bid')

const bidRoutes = (router, authRouter) => {
  authRouter.route('/bids').post(bidController.createBid)
}

module.exports = bidRoutes
