const createResponse = require('../helpers/index').createResponse;
const _formatError = require('../helpers/index').formatError;

module.exports = function (data){
  const path = typeof data.path === 'string' && data.path;
  const method = typeof data.method === 'string' && data.method.toUpperCase();

  if (!path || !method) Promise.resolve(_formatError(400, `${data.method} /${data.path}`, 'missing path or method', {path, method}));
  return Promise.resolve(createResponse(404, `${data.method} /${data.path} [Not found]`));
};