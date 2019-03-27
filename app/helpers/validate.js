const _data = require('../data');
const createError = require('./index').createError;
const parseJsonToObject = require('./index').parseJsonToObject;
const hashPassword = require('./index').hashPassword;
const _config = require('./../config');

const validateToken = function (token, user) {
  const userToken = typeof token === 'string' && token;
  if (!token) return Promise.reject(createError(400, 'validateToken', 'Missing required fields', null, {token, user}));

  if (validate.isAdmin(token)) return Promise.resolve();

  const userName = typeof user === 'string' && user;

  if (!userName) return Promise.reject(createError(400, 'validateToken', 'Missing required fields', null, {token, user}));

  const specs = {
    collection:'tokens',
    id: userToken
  };

  return _data.read(specs)
    .catch(function (e) {
      if (e.code === 'ENOENT') throw {msg: 'Token not found', statusCode:403};
      else throw e
    })
    .then(function ([file, fileId]) {
      if (file.email === userName) return token;
      else throw {msg: 'invalid token', statusCode: 403}
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
      if (e.code === 'ENOENT') throw {msg: 'User not found'};
      else throw e
    })
    .then(user => user.password !== hashPassword)
  
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