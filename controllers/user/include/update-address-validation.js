/**
 * validate user address update
 */
const updateAddressValidation = (newUserAddress) => {
  if (!newUserAddress.addressLine) {
    return 'You must enter an Address line';
  }

  if (!newUserAddress.country) {
    return 'You must enter a Country';
  }

  if (!newUserAddress.city) {
    return 'You must enter a City';
  }

  if (!newUserAddress.postcode) {
    return 'You must enter a Postcode';
  }

  return false;
}

module.exports = updateAddressValidation;
