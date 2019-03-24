const _validate = require('./../helpers/validate');
const createResponse = require('./../helpers').createResponse;
const createError = require('./../helpers').createError;
const _data = require('./../data');
const errorToObject = require('./../helpers').errorToObject;

const getMenuItem = function (data) {

};

const getMenuItems = function (data) {

};

/**
 * required:
 * admin token [string] [headers]
 * price [number] [body]
 * name [string] [body]
 * description [string] [body]
 */
const createMenuItem = function (data) {
  const path = `${data.method} /${data.path}`;
  const isAdmin = _validate.isAdmin(data.headers.token);
  if (!isAdmin) return Promise.resolve(createError(403, path, 'You need an admin token to perform this operation', null, data));

  const price = _validate.price(data.body.price);
  const name = _validate.name(data.body.name);
  const description = _validate.string(data.body.description);

  if ( !price || !name || !description) return Promise.resolve(createError(400, path, 'Missing required field', null, data));

  const specs = {
    collection: 'menu',
    item: data.body,
    id: name.replace(' ', '-').toLowerCase()
  };

  return _data.create(specs)
    .then( _ => createResponse(200, 'ok'))
    .catch(e => createError(e.statusCode || 400, `${data.method} /${data.path}`, 'Unable to add item to the menu', errorToObject(e), specs))
};

const editMenuItem = function (data) {

};

const removeMenuItem = function () {

};

module.exports = {getMenuItem, getMenuItems, createMenuItem, editMenuItem, removeMenuItem };