const _validate = require('./../helpers/validate');
const createResponse = require('./../helpers').createResponse;
const _formatError = require('./../helpers').formatError;
const _data = require('./../data');
const errorToObject = require('./../helpers').errorToObject;
const _catchError = require('./../helpers').catchError;

/**
 *  token [string] [headers]
 *  email [string] [query]
 *  id [string] [query] (menu item id)
 */
const getMenuItem = function (data) {
  const path = `${data.method} /${data.path}`;

  const token = data.headers.token;
  const email = _validate.email(data.query.email);
  const itemId = data.query.id;

  if ( (!_validate.isAdmin(token) &&  !email ) || !itemId) return Promise.resolve(_formatError(400, path, 'Missing required field', null, data));

  const specs = {
    collection: 'menu',
    id: itemId
  };

  return _validate.token(token, email)
    .then(_ => _data.read(specs))
    .then( ([item, itemId]) => createResponse(200, 'ok', item))
    .catch(_catchError('Unable to get menu item', {...data, processedSpecs: specs}))
};


/**
 *  token [string] [headers]
 *  email [string] [query]
 */
const getMenuItems = function (data) {
  const path = `${data.method} /${data.path}`;

  const token = data.headers.token;
  const email = _validate.email(data.query.email);

  if (!_validate.isAdmin(token) &&  !email) return Promise.resolve(_formatError(400, path, 'Missing required field', null, data));

  return _validate.token(token, email)
    .then(_ => _data.list('menu'))
    .then(function (list) {
      const getItems = list
        .map(function (id) {
          return _data.read({id, collection:'menu'})
            .then(([item, itemId]) => item)
        });

      return Promise.all(getItems)
    })
    .then(items => createResponse(200, 'ok', items))
    .catch(_catchError('Unable to get menu items', data))
};

/**
 * required:
 *  admin token [string] [headers]
 *  price [number] [body]
 *  name [string] [body]
 *  description [string] [body]
 */
const createMenuItem = function (data) {
  const path = `${data.method} /${data.path}`;
  const isAdmin = _validate.isAdmin(data.headers.token);

  if (!isAdmin) return Promise.resolve(_formatError(403, path, 'You need an admin token to perform this operation', null, data));

  const price = _validate.price(data.body.price);
  const name = _validate.name(data.body.name);
  const description = _validate.string(data.body.description);

  if ( !price || !name || !description) return Promise.resolve(_formatError(400, path, 'Missing required field', null, data));

  const specs = {
    collection: 'menu',
    item: data.body,
    id: name.replace(/ /g, '-').toLowerCase()
  };

  return _data.create(specs)
    .then( item => createResponse(200, 'ok', item))
    .catch(_catchError('Unable to add item to the menu', {...data, processedSpecs:specs}))
};

/**
 * required:
 *  admin token [string] [headers]
 *  id [string] [body]
 */
const editMenuItem = function (data) {
  const path = `${data.method} /${data.path}`;
  const isAdmin = _validate.isAdmin(data.headers.token);

  if (!isAdmin) return Promise.resolve(_formatError(403, path, 'You need an admin token to perform this operation', null, data));

  const id = data.query.id;
  if (!id) return Promise.resolve(_formatError(403, path, 'Missing item id', null, data));

  // Format data
  const price = _validate.price(data.body.price);
  const name = _validate.name(data.body.name);
  const description = _validate.string(data.body.description);

  const editions = Object.assign({}, data.body);

  if (price) editions.price = price;
  if (name) editions.name = name;
  if (description) editions.description = description;

  const specs = {
    collection: 'menu',
    item: editions,
    id
  };

  return _data.update(specs)
    .then( _ => createResponse(200, 'ok'))
    .catch(_catchError('Unable to update menu item', {...data, processedSpecs:specs}))
};

/**
 * required:
 *  admin token [string][headers]
 *  id [string] [query]
 */
const removeMenuItem = function (data) {
  const path = `${data.method} /${data.path}`;
  const isAdmin = _validate.isAdmin(data.headers.token);

  if (!isAdmin) return Promise.resolve(_formatError(403, path, 'You need an admin token to perform this operation', null, data));

  const id = data.query.id;
  if (!id) return Promise.resolve(_formatError(403, path, 'Missing item id', null, data));

  const specs = { collection: 'menu', id };

  return _data.remove(specs)
    .then( _ => createResponse(200, `Item ${id} successfully removed`))
    .catch(_catchError('Unable to remove item from menu', {...data, processedSpecs:specs}))
};

module.exports = {getMenuItem, getMenuItems, createMenuItem, editMenuItem, removeMenuItem };