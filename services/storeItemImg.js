var mkdirp = require('mkdirp-promise');
var multer = require('multer');
var fs = require('fs');

var Item = require('../models/itemModel');


/**
 * create disk storage space for item images
 */
const storage = multer.diskStorage({
  destination: './files',

  filename: function (req, file, cb) {
    console.log('STORAGE');

    const user = req.authUser;
    console.log(user);

    const itemId = req.params.item_id;

    const timestamp = new Date().getTime()/100;
    const targetDir = `./files/${user._id}/${itemId}`;
    const imgName = `${timestamp}-${file.originalname}`;
    const imgPath = `${user._id}/${itemId}/${imgName}`;

    /* create dir if does not already exist */
    if (!fs.existsSync(targetDir)) {
      mkdirp(targetDir).then((response) => {
        saveItemImgSrc(`${imgName}`, itemId);
        cb(null, `${imgPath}`);
      })

      return;
    }

    saveItemImgSrc(`${imgName}`, itemId);
    cb(null, `${imgPath}`);
  }
});

/**
 * save item img src to the Item Modal
 */
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

module.exports = storage
