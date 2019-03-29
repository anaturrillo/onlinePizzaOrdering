const getTemplate = require('./../../helpers/templateHelpers').getTemplate;
const getPublic = require('./../../helpers/templateHelpers').getPublicAssets;
const _formatError = require('../../helpers').formatError;

const index = _ => getTemplate('index')
  .then(function (template) {
    return {
      statusCode: 200,
      response: template,
      contentType: 'html'
    }
  });

const publicAssets = function (data) {
  const fileName = data.path.replace('public/', '');
  const fileExtention = fileName.split('.')[1];
  const types = [ 'css', 'png', 'jpg', 'ico'];

  const type = types.includes(fileExtention)?fileExtention: 'plain';

  return getPublic(fileName)
    .then(function (template) {
      return {
        statusCode: 200,
        response: template,
        contentType: type
      }
    })
    .catch(e => _formatError(400, `${data.method} /${data.path}`, `Unable to get ${fileName}`, e, data))
};

module.exports = {index, publicAssets};