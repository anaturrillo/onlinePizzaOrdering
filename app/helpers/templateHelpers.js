const {fsOpen, fsClose, fsWrite, fsRead, fsUnlink, fsTruncate, fsReadDir} = require('./promisifiedFs');
const fs = require('fs');
const path = require('path');
const parseJsonToObject = require('./index').parseJsonToObject;
const templatesDir = path.join(__dirname, '/../../templates');
const publicDir = path.join(__dirname, '/../../public');

const getTemplate = function (templateName) {

  return fsRead(`${templatesDir}/${templateName}.html`, 'utf-8')
};

const getPublicAssets = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(publicDir+ '/' + fileName, function (err,data) {
      if(!err && data) {
        resolve(data)
      } else {
        reject('no file could be found')
      }
    })
  })
  //return fsRead(`${publicDir}/${fileName}`, 'utf-8')
};

module.exports = {getTemplate, getPublicAssets};