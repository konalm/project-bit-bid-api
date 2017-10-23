var fs = require('fs');

renderImage = function (req, res) {
  const img_path = `files/${req.params.user_id}/${req.params.item_id}/${req.params.img_path}`;
  const img = fs.readFileSync(img_path);

  res.writeHead(200, {'Content-Type': 'image/png'});
  res.end(img, 'binary');
}

module.exports = renderImage
