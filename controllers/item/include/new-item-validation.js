/**
 * validate new item data
 */
newItemValidation = function (itemData) {
  console.log('new item validation');

  if (!itemData.title) {
    return {status: false, message: 'descriptive title is required'}
  }

  if (!itemData.category) {
    return {status: false, message: 'category is required'}
  }

  if (!itemData.condition) {
    return {status: false, message: 'condition is required'}
  }

  if (!itemData.description) {
    return {status: false, message: 'description is required'}
  }

  if (!itemData.sellMethod) {
    return {status: false, message: 'sell method is required'}
  }

  if (!itemData.deliveryMethod) {
    return {status: false, message: 'delivery method is required'}
  }


  if (!itemData.price && itemData.sellMethod == 1) {
    return {status: false, message: 'price is required'}
  }

  if (!itemData.bidStartingPrice && itemData.sellMethod == 2) {
    return {status: false, message: 'bid starting price requried'}
  }

  if (!itemData.bidDuration && itemData.selllMethod == 2) {
    return {status: false, message: 'bid duration required'}
  }

  if (!itemData.uploadedImagesLength > 0) {
    return {status: false, message: 'at least one photo required'}
  }

  if (itemData.description.length < 20) {
    return {
      status: false,
      message: 'at least 20 characters required for description'
    }
  }

  return {status: true, message: 'item passed validation'};
}

module.exports = newItemValidation
