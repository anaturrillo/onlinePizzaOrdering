const _config = require('../config');
const crypto = require('crypto');

const errorMessage = {
  ENOENT: 'not found',
  EEXIST: 'already exists'
};

const createError = function (statusCode, path, msg, error, data) {
  //@TODO discriminar los casos en los que hay que mandar 500
  //@TODO no mandar .info en NODE_ENV prod
  return {
    statusCode: statusCode || 400,
    response: {
      error: (msg && error && errorMessage[error.code] && `${msg} [${errorMessage[error.code]}]` ) || msg || (error && (errorMessage[error.code] || error.msg)) || 'error indefinido',
      failedAt: path,
      info: {
        sentData: data,
        error
      }
    }
  }
};

const errorToObject = e => Object.getOwnPropertyNames(e)
  .reduce(function (error, prop) {
    return {...error, [prop]: e[prop]};
  }, {});

const createResponse = function (statusCode, msg, data) {
  return {
    statusCode: statusCode || 200,
    response: {msg: msg || '', body:data || {}}
  }
};

const parseJsonToObject = function(str){
  try {
    return JSON.parse(str);
  } catch (e) {
    return  {}
  }
};

const hashPassword = str => crypto.createHmac('sha256', _config.hashingSecret).update(str).digest('hex');

const exclude = key => obj => {
  delete  obj[key];
  return obj
};

module.exports = {createError, parseJsonToObject, createResponse, errorToObject, hashPassword, exclude};