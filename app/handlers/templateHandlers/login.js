const _getTemplate = require('./../../helpers/templateHelpers').addBasicTemplates;
const _catchError = require('../../helpers').catchError;
const _createResponse = require('./../../helpers/templateHelpers').createTemplateResponse;

const login = function (data) {

  return _getTemplate('login', {})
    .then(_createResponse)
    .catch(_catchError(`Unable to get ${data.path}`, data))
};

module.exports = login;