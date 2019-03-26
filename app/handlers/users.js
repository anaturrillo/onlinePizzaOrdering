const createResponse = require('./../helpers').createResponse;
const createError = require('./../helpers').createError;
const _data = require('./../data');
const _validate = require('./../helpers/validate');
const _exclude = require('./../helpers').exclude;
const rmPass = _exclude('password');
const errorToObject = require('./../helpers').errorToObject;

const getUsers = function (data) {
  return _data.list('users')
    .then(users => createResponse(200, 'ok', users))
    .catch(e => createError(e.statusCode || 400, `${data.method} /${data.path}`, 'Unable to get users', errorToObject(e), data))
};

/**
 * required fields: email
 */
const getUser = function (data) {
  const email = _validate.email(data.query.email);
  const token = data.headers.token;

  if (!email) return Promise.resolve(createError(400, `${data.method} /${data.path} - query: ${data.query.email}`, 'Missing required fieldsemail', null, data));
  //if (!token) return Promise.resolve(createError(403, 'Missing or invalid token'));
  const specs = {id: email, collection: 'users'};

  return _validate.token(token, email)
    .then(function (isTokenValid) {
      if (isTokenValid) return _data.read(specs);

    })
    .then( ([fileContent, fileId]) => createResponse(200, 'ok', rmPass(fileContent)) )
    .catch(e => createError(e.statusCode || 400, `${data.method} /${data.path} - ${data.query.email}`, 'Unable to get user', errorToObject(e), specs))
};

/**
 * required fields: name, address, email
 */
const createUser = function (data) {
  const name = _validate.name(data.body.name);
  const address = _validate.address(data.body.address);
  const email = _validate.email(data.body.email);
  const password = _validate.passwordToSet(data.body.password);

  if (!name || !address || !email || !password) return Promise.resolve(createError(400, `${data.method} /${data.path}`, 'missing required fields', null, data));

  const specs = {
    collection: 'users',
    id: email,
    item: {name, address, password}
  };

  return _data.create(specs)
    .then(function (item) {
      return createResponse(200, 'User has been successfully created', rmPass(item))
    })
    .catch(e => createError(400, `${data.method} /${data.path}`, 'Unable to create user', errorToObject(e), specs))
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

  if (!email) return Promise.resolve(createError(400, `${data.method} /${data.path}`, 'Missing required field email', null, data));

  if (!name && !address && !password) return Promise.resolve(createError(400, `${data.method} /${data.path}`, 'Missing any field to update', null, data));

  const specs = {
    collection: 'users',
    id: email,
    item: data.body
  };

  return _validate.token(token, email)
    .then(function (isTokenValid) {
      if (isTokenValid) return _data.update(specs);
    })
    .then(item => createResponse(200, 'User updated successfully', rmPass(item)))
    .catch(e => createError(e.statusCode || 400, `${data.method} /${data.path}`, 'Unable to update user', errorToObject(e), specs))
};

const removeUser = function (data) {
  const email = _validate.email(data.query.email);
  const token = data.headers.token;

  if (!email) return Promise.resolve(createError(400, `${data.method} /${data.path}`, 'Email is invalid or missing', null, data));

  const userSpecs = {id: data.query.email, collection: 'users'};
  const cartSpecs = {id: data.query.email, collection: 'carts'};
  const userTokenSpecs = {collection:'tokens', id: token};

  return _validate.token(token, email)
    .then(function () {
      const user = _data.read(userSpecs).catch(e => false);
      const tokens = _data.read(userTokenSpecs).catch(e => false);
      const carts = _data.read(cartSpecs).catch(e => false);

      return Promise.all([user, tokens, carts])
    })
    .then(function ([user, tokens, carts]) {
      const promises = [];
      if (user) promises.concat(_data.remove(userSpecs));
      if (tokens) promises.concat(_data.remove(userTokenSpecs));
      if (carts) promises.concat(_data.remove(cartSpecs));

      return Promise.all(promises)
    })
    .then(_ => createResponse(200, 'Document deleted successfully', {userRemoved: userSpecs.id}))
    .catch(e => createError(e.statusCode || 400, `${data.method} /${data.path}`, 'Unable to remove user', errorToObject(e), userSpecs))
};

module.exports = { getUser, getUsers, createUser, updateUser, removeUser };