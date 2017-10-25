const addressValidation = (address) => {
  if (!address.addressLine) {
    return {status: false, message: 'address line is required'}
  }

  if (!address.city) {
    return {status: false, message: 'city is required'}
  }

  if (!address.postcode) {
    return {status: false, message: 'postcode is requried'}
  }

  return {status: true, message: 'passed validation'}
}

module.exports = addressValidation;
