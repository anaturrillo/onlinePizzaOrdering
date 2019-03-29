const _formatError = require('./../helpers').formatError;
const createResponse = require('./../helpers').createResponse;
const _data = require('./../data');
const _validate = require('./../helpers/validate');
const _errorToObject = require('./../helpers').errorToObject;
const _createRandomString = require('./../helpers').createRandomString;
const _catchError = require('./../helpers').catchError;

const createToken = function (data) {
  const email = _validate.email(data.body.email);
  const password = data.body.password;

  if (!email || !password) return Promise.resolve(_formatError(400, `${data.method} /${data.path}`, 'Missing required fields', null, data));
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
    .then(_ => _data.create(specs))
    .then(token => createResponse(200, 'Token created successfully', {forUser: email, token: token.id}))
    .catch(_catchError('Unable to create token', {...data, processedSpecs:specs}))
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

  if (!token || !email) return Promise.resolve(_formatError(400, `${data.method} /${data.path}`, 'Missing required field',null, data))

  const specs = {
    collection:'tokens',
    id: token
  };

  return _validate.token(token, email)
    .then(_ => _data.remove(specs))
    .then(_ => createResponse(200, 'Token removed successfully', {forUser: email, token: token}))
    .catch(_catchError('Unable to remove token', {...data, processedSpecs:specs}))
};

module.exports = {createToken, getTokens, editToken, removeToken};