const createError = require('./../helpers').createError;
const createResponse = require('./../helpers').createResponse;
const _data = require('./../data');
const _validate = require('./../helpers/validate');
const _errorToObject = require('./../helpers').errorToObject;
const _createRandomString = require('./../helpers').createRandomString;

const createToken = function (data) {
  const email = _validate.email(data.body.email);
  const password = data.body.password;

  if (!email || !password) return Promise.resolve(createError(400, `${data.method} /${data.path}`, 'Missing required fields', null, data));
  const tokenId = _createRandomString(20);
  const specs = {
    collection: 'tokens',
    id: tokenId,
    item: {
      email,
      id: tokenId
    }
  };

  return _validate.password(password,email)
    .then(function (isPasswordValid) {
      if (isPasswordValid) {
        return _data.create(specs)
      } else {
        throw {msg: 'Wrong password'}
      }
    })
    .then(_ => createResponse(200, 'Token created successfully', {forUser: email, token: tokenId}))
    .catch(e => createError(400, `${data.method} /${data.path}`, 'Unable to create token', _errorToObject(e), specs))
};

const getTokens = function (data) {

};

const editToken = function (data) {

};

const removeToken = function (data) {

};

module.exports = {createToken, getTokens, editToken, removeToken};