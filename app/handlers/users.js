const createResponse = require('./../helpers').createResponse;
const createError = require('./../helpers').createError;
const _data = require('./../data');
const _validate = require('./../helpers/validate');
const _exclude = require('./../helpers').exclude;
const rmPass = _exclude('password');
const errorToObject = require('./../helpers').errorToObject;

const getUsers = function (data) {
  return _data.list('users')
};

/**
 * required fields: email
 */
const getUser = function (data) {
  const email = _validate.email(data.query.email);
  const token = data.headers.token;

  if (!email) return Promise.resolve(createError(400,`${data.method} /${data.path} - query: ${data.query.email}`,'Missing required fieldsemail',null,data));
  //if (!token) createError(403, 'Missing or invalid token');

  const specs = { id: email, collection:'users' };

  return _data.read(specs)
    .then(([fileContent, fileId]) => createResponse(200, 'ok', JSON.parse(rmPass(fileContent))))
    .catch(e => createError(400, `${data.method} /${data.path} - ${data.query.email}`, 'Unable to get user', errorToObject(e), specs))
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
    item: {name, address, email, password}
  };

  return _data.create(specs)
    .then(function (item) {
      return createResponse(200, 'User has been successfully created', rmPass(item))
    })
    .catch(e => createError(400, `${data.method} /${data.path}`, 'Unable to create user', errorToObject(e), specs))
};

const updateUser = function (data) {
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

  return _data.update(specs)
    .then(item => createResponse(200, 'User updated successfully', rmPass(item)))
    .catch(e => createError(400, `${data.method} /${data.path}`, 'Unable to update user', errorToObject(e), specs))
};

const removeUser = function (data) {
  const email = _validate.email(data.body.email);

  if (!email) return Promise.resolve(createError(400, `${data.method} /${data.path}`, 'Missing required field email', null, data));

  const specs = {id: data.query.email, collection: 'users'};
  return _data.remove(specs)
    .then(_ => createResponse(200, 'Document deleted successfully', {userRemoved: specs.id}))
    .catch(e => createError(400, `${data.method} /${data.path}`, 'Unable to remove user',errorToObject(e), specs))
};

module.exports = {getUser, getUsers, createUser, updateUser, removeUser};