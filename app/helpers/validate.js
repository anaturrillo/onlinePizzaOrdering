const _data = require('../data');
const createError = require('./index').createError;
const hashPassword = require('./index').hashPassword;

const validateToken = function (token, user) {
  const userToken = typeof token === 'string' && token;
  const userName = typeof user === 'string' && user;

  if (!token || userName) return createError(400, 'validateToken', 'Missing required fields', {token, user});

  return _data.read('tokens', userToken)
    .then(function (resp) {
      if(resp.data.email === user) return true;
      else return createError(403, 'getUser', 'no se pudo validar el token', data)
    })
};

const validate = {
  email: email => typeof email === 'string' && email.includes('@') && email.split('@')[1].includes('.') && email,
  name: name => typeof name === 'string' && name,
  address: address => typeof address === 'string' && address,
  passwordToSet: password => typeof password === 'string' && password.trim().length > 0 && hashPassword(password.trim()),
  token: validateToken
};

module.exports = validate;