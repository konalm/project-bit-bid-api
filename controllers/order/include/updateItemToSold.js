updateItemToSold = function (item) {
  item.update({sold: true}, (err, data) => {
    if (err) { throw new Error (err); }
  });
}

exports.module = updateItemToSold
