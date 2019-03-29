const {fsOpen, fsClose, fsWrite, fsRead, fsUnlink, fsTruncate, fsReadDir} = require('./promisifiedFs');
const fs = require('fs');
const path = require('path');
const parseJsonToObject = require('./index').parseJsonToObject;
const templatesDir = path.join(__dirname, '/../../templates');
const publicDir = path.join(__dirname, '/../../public');
const siteData = require('./../config').siteInfo;

const getTemplate = function (templateName) {
  return fsRead(`${templatesDir}/${templateName}.html`, 'utf-8')
};

const getPublicAssets = function ({fileName, type}) {
  const encoding = {
    css: 'utf-8',
    html: 'utf-8',
    png: null,
    jpg: null,
    plain: 'utf-8',
    pdf: null
  };

  return fsRead(`${publicDir}/${fileName}`, encoding[type])
};

const addBasicTemplates = function (templateName, templateData) {
  return Promise.all([getTemplate('_header'), getTemplate(templateName), getTemplate('_footer')])
    .then(function ([header, template, footer]) {
      const rawTemplate = header+template+footer;
      const globalData = Object.keys(siteData)
        .reduce(function (data, item) {
          data[`global.${item}`] = siteData[item];
          return data;
        }, {});

      const data = Object.assign(globalData, templateData);
      const dataItems = Object.keys(data);

      return dataItems.reduce(function (template, dataItem) {
        return template.replace(`\${${dataItem}}`, data[dataItem])
      }, rawTemplate);
    })
};

const createTemplateResponse = function (template) {
  return {
    statusCode: 200,
    response: template,
    contentType: 'html'
  }
};

module.exports = {getTemplate, getPublicAssets, addBasicTemplates, createTemplateResponse};