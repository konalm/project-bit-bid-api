var multer = require('multer');
var fs = require('fs');

var Token = require('./models/token');


const storage = multer.diskStorage({
  destination: '/files',

  filename (req, file, cb) {
    const token = req.get('Authorization');

    Token.findOne({value: token}, 'userId').exec()

    .then(res => {
      console.log('.then ????');
      console.log(res.userId);

      const timestamp = new Date().getTime()/100;

      if (!fs.existsSync(`./files/${res.userId}`)) {
        fs.mkdirSync(`./files/${res.userId}`);
      }

      cb(null, `${res.userId}/${timestamp}-${file.originalname}`);
    })
  }
});

export default storage;
