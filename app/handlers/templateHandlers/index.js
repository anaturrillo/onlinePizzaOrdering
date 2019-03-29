const getTemplate = require('./../../helpers/templateHelpers').addBasicTemplates;
const publicAssets = require('./publicAssets');
const createAccount = require('./createAccount');
const login = require('./login');

const index = _ => getTemplate('index', {templateClass:'index'})
  .then(function (template) {
    return {
      statusCode: 200,
      response: template,
      contentType: 'html'
    }
  });



module.exports = {index, publicAssets, createAccount, login};