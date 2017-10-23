/**
 * set response headers that will grant specific origin access to specific
 * requests
 */
const allowClientAccess = (res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);

  return res;
}

module.exports = allowClientAccess
