const _formatError = require('./../helpers').formatError;
const createResponse = require('./../helpers').createResponse;
const _data = require('./../data');
const _validate = require('./../helpers/validate');
const _errorToObject = require('./../helpers').errorToObject;
const _createRandomString = require('./../helpers').createRandomString;
const _catchError = require('./../helpers').catchError;

/**
 * required:
 *  email [string] [body]
 *  token [string] [headers]
 */
const createCart = function (data) {
  const email = _validate.email(data.body.email);
  const token = data.headers.token;

  if (!email ) return Promise.resolve(_formatError(400, `${data.method} /${data.path}`, 'Missing required field', null, data));


  const specs = {
    collection: 'carts',
    id: email,
    item: {
      id: email
    }
  };

  return _validate.token(token,email)
    .then(_ => _data.create(specs))
    .then(cart => createResponse(200, 'Cart created successfully', cart))
    .catch(_catchError('Unable to create cart', {...data, processedSpecs:specs}))
};

/**
 * required:
 *  email [string] [query]
 *  token [string] [headers]
 */
const getCart = function (data) {
  const email = _validate.email(data.query.email);
  const token = data.headers.token;

  if (!email ) return Promise.resolve(_formatError(400, `${data.method} /${data.path}`, 'Missing required field', null, data));

  const specs = {
    collection: 'carts',
    id: email
  };

  return _validate.token(token, email)
    .then(_ => _data.read(specs))
    .then(([cart, id])  => createResponse(200, 'ok', cart))
    .catch(_catchError('Unable to get cart', data))
};

/**
 * required:
 *  token [string] [headers]
 *  email [string] [body]
 *  item [object] [body]
 *    item.itemId [string] [body]
 *    item.amount [number] [body]
 */
const addToCart = function (data) {
  const email = _validate.email(data.body.email);
  const token = data.headers.token;
  const item = typeof data.body.item === 'object' && data.body.item;
  const amount = item && _validate.amount(item.amount);
  const itemId = item.itemId;

  if (!email || !amount || !item || !itemId) return Promise.resolve(_formatError(400, `${data.method} /${data.path}`, 'Missing required field', null, data));

  const specs = {collection:'carts', id: email};

  return _validate.token(token, email)
    .then(item => _data.read(specs))
    .then(([cart, id]) => Promise.all([_validate.menuItem(data.body.item), cart]))
    .then(function ([menuItem, cart]) {
      const cartItems = cart.items || [];
      const id = _createRandomString(7);
      const menuItems = [...cartItems, Object.assign(menuItem, {id})];

      const specs = {
        collection: 'carts',
        id: email,
        item: Object.assign({}, cart, {items: menuItems})
      };

      return _data.update(specs)
    })
    .then(cart=> createResponse(200, 'The item was added to the cart', cart))
    .catch(_catchError('Unable to add item to cart', data))
};

/**
 * required:
 *  token [string] [headers]
 *  email [string] [body]
 *  itemId [string] [body]
 */
const removeFromCart = function (data) {
  const email = _validate.email(data.body.email);
  const token = data.headers.token;
  const itemId = data.body.id;

  if (!email || !itemId) return Promise.resolve(_formatError(400, `${data.method} /${data.path}`, 'Missing required field', null, data));

  const specs = {collection:'carts', id: email};

  return _validate.token(token, email)
    .then(item => _data.read(specs))
    .then(function ([cart, id]) {
      const cartItems = cart.items || [];

      if (!cartItems.find(e => e.id ===itemId)) {
        throw _formatError(400, `${data.method} /${data.path}`, 'Item was not find in cart', null, data);
      }

      const menuItems = cartItems.filter(e => e.id !== itemId);
      const specs = {
        collection: 'carts',
        id: email,
        item: Object.assign({}, cart, {items: menuItems})
      };

      return _data.update(specs)
    })
    .then(cart=> createResponse(200, 'The item was removed from the cart', cart))
    .catch(_catchError('Unable to remove item from cart', data))
};

/**
 * required:
 *  email [string] [query]
 *  token [string] [headers]
 */
const removeCart = function (data) {
  const email = _validate.email(data.query.email);
  const token = data.headers.token;

  if (!email) return Promise.resolve(_formatError(400, `${data.method} /${data.path}`, 'Missing required field', null, data));

  const specs = {collection:'carts', id: email};

  return _validate.token(token, email)
    .then(item => _data.remove(specs))
    .then(cart=> createResponse(200, 'Cart removed', cart))
    .catch(_catchError('Unable to remove cart', data))
};

module.exports = {createCart, addToCart, removeFromCart, getCart, removeCart};