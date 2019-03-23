const createResponse = require('../helpers/index').createResponse;
const createError = require('../helpers/index').createError;

module.exports = function (req, res, data){
  const path = typeof data.path === 'string' && data.path;
  const method = typeof data.method === 'string' && data.method.toUpperCase();

  if (!path || !method) Promise.resolve(createError(400, 'notFound method', 'missing path or method', {path, method}));

  Promise.resolve(createResponse(404, 'recurso no encontrado: ' + method + ' /' + path));
};