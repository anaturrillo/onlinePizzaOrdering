const _data = require('../data');
const _formatError = require('./index').formatError;
const hashPassword = require('./index').hashPassword;
const _config = require('./../config');

const validateToken = function (token, user) {
  const userToken = typeof token === 'string' && token;

  if (!token) return Promise.reject(_formatError(400, 'validateToken', 'Missing required fields', null, {token, user}));

  if (validate.isAdmin(token)) return Promise.resolve();

  const userName = typeof user === 'string' && user;

  if (!userName) return Promise.reject(_formatError(400, 'validateToken', 'Missing required fields', null, {token, user}));

  const specs = {
    collection:'tokens',
    id: userToken
  };

  return _data.read(specs)
    .catch(function (e) {
      if (e.code === 'ENOENT') throw _formatError(403, 'validateToken', 'Token not found', null, {token, user});
      else throw _formatError(500, 'validateToken', 'Could not read token', null, {token, user});
    })
    .then(function ([file, fileId]) {
      if (file.email === userName) return true;
      else  throw _formatError(403, 'validateToken', 'Invalid token', null, {token, user});
    })
};

const validatePassword = function (password, email) {
  const specs = {
    collection: 'users',
    id: email
  };

  const hashedPass = hashPassword(password);

  return _data.read(specs)
    .catch(function (e) {
      if (e.code === 'ENOENT') throw _formatError(403, 'validatePassword', 'User not found', {}, {});
      else throw e
    })
    .then(function ([user]) {
      //debugger
      if (user.password !== hashedPass) throw _formatError(403, 'validatePassword', 'Invalid password/user', {}, {})
    })
  
};

const validateMenuItem = function (item) {
  return _data.read({collection: 'menu', id: item.itemId})
    .then(_ => item)
    .catch(function (e) {
      if (e.code === 'ENOENT') throw {msg: 'Menu item not found: ' + item.itemId};
      else throw e
    })
};

const validate = {
  email: email => typeof email === 'string' && email.includes('@') && email.split('@')[1].includes('.') && email,
  name: name => typeof name === 'string' && name.trim(),
  address: address => typeof address === 'string' && address,
  passwordToSet: password => typeof password === 'string' && password.trim().length > 0 && hashPassword(password.trim()),
  price: price => typeof price === 'number' && price > 0 && price,
  amount: amount => typeof amount === 'number' && amount > 0 && amount,
  string: string => typeof string === 'string' && string.trim().length > 0 && string,
  cart: (cart, email) => cart.email === email && cart,
  menuItem: validateMenuItem,
  password: validatePassword,
  token: validateToken,
  isAdmin: token => token === _config.adminToken
};

module.exports = validate;