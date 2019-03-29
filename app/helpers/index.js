const _config = require('../config');
const crypto = require('crypto');
const _log = require('./../log');

const errorMessage = {
  ENOENT: 'not found',
  EEXIST: 'already exists'
};

const formatError = function (statusCode, path, msg, error, data) {
  //@TODO discriminar los casos en los que hay que mandar 500
  //@TODO no mandar .info en NODE_ENV prod
  const errorData = {
    isFormattedError: true,
    statusCode: statusCode || 400,
    response: {
      error: (msg && error && (errorMessage[error.code] || error.msg ) && `${msg} [${errorMessage[error.code] || error.msg}]` ) || msg || (error && (errorMessage[error.code] || error.msg)) || 'error indefinido',
      failed: path,
      info: {
        sentData: data,
        error
      }
    }
  };

  //return _log(errorData).then(_ => errorData);
  return errorData;
};

const createRandomString = function (strLength) {
  const possibleCharacters = 'abcdefghijkrstuvwxyz0123456789';

  let str = '';

  for (let i = 1; i <= strLength; i++) {
    str += possibleCharacters.charAt(Math.floor(Math.random()*possibleCharacters.length));
  }
  return str;
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

const catchError = (msg, data, status) => function (e) {
  //debugger
  if (e.isFormattedError) return e;
  else return formatError(status || 400, `${data.method} /${data.path}`, msg, errorToObject(e), data)
};

module.exports = {formatError, catchError, parseJsonToObject, createResponse, errorToObject, hashPassword, exclude, createRandomString};