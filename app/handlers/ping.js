const createResponse = require('../helpers/index').createResponse;

module.exports = function (req, res, reqData) {
  return new Promise(function (resolve, reject) {
    resolve(createResponse(200, 'pong!'))
  })
};