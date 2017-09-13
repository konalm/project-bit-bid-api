var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var bluebird = require('bluebird');
var mkdirp = require('mkdirp-promise');
var fs = require('fs');

var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var passport = require('passport');

var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var oauth2Controller = require('./controllers/oauth2');
var clientController = require('./controllers/client');
var itemController = require('./controllers/itemController');
var chargeController = require('./controllers/chargeController');
var orderController = require ('./controllers/order');

var User = require('./models/user');
var Token = require('./models/token');
var ItemImgModel = require('./models/item-images-model');
var Item = require('./models/itemModel');

mongoose.connect('mongodb://localhost/bit_bid_dev');
mongoose.Promise = require('bluebird');

var app = express();

/* Use the body-parser package in our application */
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({extended: true}));

/* Allow client access */
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

/* Create our Express router */
var authRouter = express.Router();
var router = express.Router();

/* authorization middleware */
authRouter.use(function (req, res, next) {
  if (req.method === 'OPTIONS') { next(); return; }

  Token.findOne({value: req.get('Authorization')}, 'userId')
    .then(res => {
      getUser(res.userId)
    })
    .catch(err => {
      return res.status(406).send('Not authenticated')
    })

  const getUser = (userId) => {
    User.findById(userId).then(user => {
        req.authUser = user
        next()
      })
      .catch(err => {
        return res.status(406).send('Not authenticated')
      })
  }
});

const storage = multer.diskStorage({
  destination: './files',

  filename (req, file, cb) {
    const token = req.get('Authorization');
    const itemId = req.params.item_id;

    Token.findOne({value: token}, 'userId').exec()

    .then(res => {
      const timestamp = new Date().getTime()/100;
      const targetDir = `./files/${res.userId}/${itemId}`;
      const imgName = `${timestamp}-${file.originalname}`;
      const imgPath = `${res.userId}/${itemId}/${imgName}`;

      if (!fs.existsSync(targetDir)) {
        mkdirp(targetDir)
          .then((response) => {
            saveItemImgSrc(`${imgName}`, itemId);
            cb(null, `${imgPath}`);
          })

        return;
      }

      saveItemImgSrc(`${imgName}`, itemId);
      cb(null, `${imgPath}`);
    })
  },
});

const upload = multer({ storage });

const saveItemImgSrc = function (imgPath, itemId) {
  var item = Item.findById(itemId, function(err, item) {
    if (err) { res.send(err); }

    let imgCollection = item.imgCollection;
    imgCollection.push(imgPath);
    item.imgCollection = imgCollection;

    item.save(function(err) {
      if (err) { console.log(err); }
    });
  });
}


/* users */
router.route('/users')
  .post(userController.postUsers);

router.route('/user')
  .get(userController.getUser);

authRouter.route('/user-address')
  .put(userController.updateAddress)
  .get(userController.getUserAddress);

router.route('/user-billing')
  .get(userController.getUserBilling);

router.route('/users-profile/:username')
  .get(userController.getUserForView);

authRouter.route('/user-update-stripe')
  .post(userController.updateStripe);

router.route('/login')
  .post(authController.postLogin);


/* items */
router.route('/items')
  .get(itemController.getItems)
  .post(itemController.postItem);

router.route('/items/category/:category_id')
  .get(itemController.getItemsByCategory);

router.route('/items/fuzzy-search/:search_query')
  .get(itemController.getItemsByFuzzySearch);

router.route('/items/category/:category/search/:search_query')
  .get(itemController.getItems);

router.route('/items/:item_id')
  .get(itemController.getItem)
  .post(upload.any(), itemController.uploadItemImages);

/* charge */
authRouter.route('/handle-order-transaction')
  .post(chargeController.handleOrderTransaction);

/* orders */
authRoute.route('/orders')
  .get(orderController.getOrders);

authRouter.route('/orders/:order_id')
  .get(orderController.getOrder);


/**
 * render image response
 */
router.get('/render-item-img/:user_id/item/:item_id/img-path/:img_path', function(req, res) {
  const img_path = `files/${req.params.user_id}/${req.params.item_id}/${req.params.img_path}`;
  const img = fs.readFileSync(img_path);

  res.writeHead(200, {'Content-Type': 'image/png'});
  res.end(img, 'binary');
});

router.post('/upload', upload.any(), function(req, res, next) {
  res.end();
});

/* Register all routes with /api */
app.use('/api', router);
app.use('/api', authRouter);

/* Start the server */
app.listen(8080);
