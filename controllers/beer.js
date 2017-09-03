var Beer = require('../models/beer');

/**
 * post
 **/
exports.postBeers = function(req, res) {
  var beer = new Beer();

  beer.name = req.body.name;
  beer.type = req.body.type;
  beer.quantity = req.body.quantity;
  beer.userId = req.user._id;

  beer.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Beer added !!', data: beer});
  });
};

/**
 * get all
 */
exports.getBeers = function (req, res) {
  Beer.find(function(err, beers) {
    if (err) res.send(err);

    res.json(beers);
  });
}

/**
 * get
 */
exports.getBeer = function(req, res) {
  Beer.findById(req.params.beer_id, function(err, beer) {
    if (err) res.send(err);

    res.json(beer);
  });
};

/**
 * put
 */
exports.putBeer = function(req, res) {
  Beer.findById(req.params.beer_id, function(err, beer) {
    if (err)
      res.send(err);

    beer.quantity = req.body.quantity;

    beer.save(function(err) {
      if (err)
        res.send(err);

      res.json(beer);
    });
  });
}

/**
 * delete
 */
exports.deleteBeer = function(req, res) {
  Beer.remove({ userId: req.user._id, _id: req.params.beer_id}, function(err) {
    if (err) res.send(err);

    res.json({ message: 'Beer remove !!'});
  })
};
