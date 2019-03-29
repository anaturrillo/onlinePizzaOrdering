const createResponse = require('./../helpers').createResponse;
const _formatError = require('./../helpers').formatError;
const _catchError = require('./../helpers').catchError;
const _data = require('./../data');
const _validate = require('./../helpers/validate');
const _exclude = require('./../helpers').exclude;
const rmPass = _exclude('password');
const errorToObject = require('./../helpers').errorToObject;

const getUsers = function (data) {

  if (!_validate.isAdmin(data.headers.token) ) return Promise.resolve(_formatError(403, `${data.method} /${data.path}`, 'You need an admin token to get requested data', {}, {}));

  return _data.list('users')
    .then(users => createResponse(200, 'ok', users))
    .catch(_catchError('Unable to get users', data))
};

/**
 * required fields: email
 */
const getUser = function (data) {
  const email = _validate.email(data.query.email);
  const token = data.headers.token;

  if (!email) return Promise.resolve(_formatError(400, `${data.method} /${data.path} - query: ${data.query.email}`, 'Missing required fieldsemail', null, data));
  const specs = {id: email, collection: 'users'};

  return _validate.token(token, email)
    .then(_ => _data.read(specs))
    .then( ([fileContent, fileId]) => createResponse(200, 'ok', rmPass(fileContent)) )
    .catch(_catchError('Unable to get user', data))
};

/**
 * required fields: name, address, email
 */
const createUser = function (data) {
  const name = _validate.name(data.body.name);
  const address = _validate.address(data.body.address);
  const email = _validate.email(data.body.email);
  const password = _validate.passwordToSet(data.body.password);

  if (!name || !address || !email || !password) return Promise.resolve(_formatError(400, `${data.method} /${data.path}`, 'missing required fields', null, data));

  const specs = {
    collection: 'users',
    id: email,
    item: {name, address, password}
  };

  return _data.create(specs)
    .then(item => createResponse(200, 'User has been successfully created', rmPass(item)))
    .catch(_catchError('Unable to create user', {...data, processedSpecs:specs}))
};

/**
 * required fields: email, token, one of: name, address, password
 */
const updateUser = function (data) {
  const token = data.headers.token;
  const name = _validate.name(data.body.name);
  const address = _validate.address(data.body.address);
  const email = _validate.email(data.body.email);
  const password = _validate.passwordToSet(data.body.password);

  if (!email) return Promise.resolve(_formatError(400, `${data.method} /${data.path}`, 'Missing required field email', null, data));

  if (!name && !address && !password) return Promise.resolve(_formatError(400, `${data.method} /${data.path}`, 'Missing any field to update', null, data));

  const fieldsToUpdate = {};

  if(name) fieldsToUpdate.name = name;
  if(address) fieldsToUpdate.address = address;
  if(email) fieldsToUpdate.email = email;
  if(password) fieldsToUpdate.password = password;

  const specs = {
    collection: 'users',
    id: email,
    item: Object.assign(data.body, fieldsToUpdate)
  };

  return _validate.token(token, email)
    .then(_ => _data.update(specs))
    .then(item => createResponse(200, 'User updated successfully', rmPass(item)))
    .catch(_catchError('Unable to update user', {...data, processSpecs:specs}))
};

const removeUser = function (data) {
  const email = _validate.email(data.query.email);
  const token = data.headers.token;

  if (!email) return Promise.resolve(_formatError(400, `${data.method} /${data.path}`, 'Email is invalid or missing', null, data));

  const userSpecs = {id: data.query.email, collection: 'users'};
  const cartSpecs = {id: data.query.email, collection: 'carts'};
  const userTokenSpecs = {collection:'tokens', id: token};

  return _validate.token(token, email)
    .then(function () {
      const user = _data.read(userSpecs).catch(_ => false);
      const tokens = _data.read(userTokenSpecs).catch(_ => false);
      const carts = _data.read(cartSpecs).catch(_ => false);

      return Promise.all([user, tokens, carts])
    })
    .then(function ([user, tokens, carts]) {
      const promises = [];
      if (user) promises.push(_data.remove(userSpecs));
      if (tokens) promises.push(_data.remove(userTokenSpecs));
      if (carts) promises.push(_data.remove(cartSpecs));
      return Promise.all(promises)
    })
    .then(_ => createResponse(200, 'User deleted successfully', {userRemoved: userSpecs.id}))
    .catch(_catchError('Unable to remove user', data))
};

module.exports = { getUser, getUsers, createUser, updateUser, removeUser };