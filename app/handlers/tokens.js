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
  return Promise.resolve(createResponse(501,'Service not implemented yet, sorry :)'))
};

const editToken = function (data) {
  return Promise.resolve(createResponse(501,'Service not implemented yet, sorry :)'))
};

const removeToken = function (data) {
  const token = data.headers.token;
  const email = _validate.email(data.query.email);

  if (!token || !email) return Promise.resolve(createError(400, `${data.method} /${data.path}`, 'Missing required field',null, data))

  const specs = {
    collection:'tokens',
    id: token
  };

  return _validate.token(token, email)
    .then(_ => _data.remove(specs))
    .then(_ => createResponse(200, 'Token removed successfully', {forUser: email, token: token}))
    .catch(e => createError(400, `${data.method} /${data.path}`, 'Unable to create token', _errorToObject(e), specs))
};

module.exports = {createToken, getTokens, editToken, removeToken};