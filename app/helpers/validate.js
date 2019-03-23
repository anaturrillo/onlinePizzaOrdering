const _data = require('../data');
const createError = require('./index').createError;
const parseJsonToObject = require('./index').parseJsonToObject;
const hashPassword = require('./index').hashPassword;

const validateToken = function (token, user) {
  const userToken = typeof token === 'string' && token;
  const userName = typeof user === 'string' && user;

  if (!token || !userName) return Promise.reject(createError(400, 'validateToken', 'Missing required fields', null, {token, user}));

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

const validate = {
  email: email => typeof email === 'string' && email.includes('@') && email.split('@')[1].includes('.') && email,
  name: name => typeof name === 'string' && name,
  address: address => typeof address === 'string' && address,
  passwordToSet: password => typeof password === 'string' && password.trim().length > 0 && hashPassword(password.trim()),
  password: validatePassword,
  token: validateToken
};

module.exports = validate;