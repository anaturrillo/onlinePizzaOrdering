const path = require('path');
const {fsOpen, fsClose, fsWrite, fsRead, fsUnlink, fsTruncate, fsReadDir} = require('./helpers/promisifiedFs');

//const parseJsonToObject = require('./../app/helpers/index').parseJsonToObject;
const parseJsonToObject = function(str){
  try {
    return JSON.parse(str);
  } catch (e) {
    return  {}
  }
};

const baseDir = path.join(__dirname, '/../.data');

const init = ({collection, id, item, flag}) => {
  let dir = `${baseDir}/${collection}`;
  if (id) dir += `/${id}.json`;

  return {
    open: _ => Promise.all([_ , fsOpen(dir, flag)]),
    write: ([_, fileId]) =>  Promise.all([fsWrite(fileId, JSON.stringify(item)), fileId]),
    close: ([_, fileId]) => fsClose(fileId),
    read: ([_, fileId]) => Promise.all([fsRead(dir, 'utf-8'), fileId]),
    truncate: ([_, fileId]) => Promise.all([fsTruncate(fileId), fileId]),
    remove: _ => fsUnlink(dir),
    list: _ => fsReadDir(dir),
    update: ([_, fileId]) => fsRead(dir, 'utf-8')
        .then(content => {
          const savedContent = parseJsonToObject(content);
          const updatedContent = JSON.stringify(Object.assign({}, savedContent, item));

          return [updatedContent, fileId]
        })
        .then(([updatedContent, fileId]) => Promise.all([updatedContent, fileId, fsTruncate(fileId)]))
        .then(([updatedContent, fileId]) => Promise.all([fsWrite(fileId, updatedContent), fileId]))
  }
};

const create = function ({collection, item, id}) {
  item = Object.assign(item, {id});
  const file = init({collection, id, item, flag:'wx'});

  return file.open()
    .then(file.write)
    .then(file.close)
    .then(_ => item)
};

const read = function ({collection, id}) {
  const file = init({collection, id});

  return file.read([])
    .then(([file, fileId]) => [parseJsonToObject(file), fileId])

};

const update = function ({collection, item, id}) {
  const file = init({collection, id, item, flag:'r+'});

  return file.open()
    .then(file.update)
    .then(file.close)
    .then(_ => item)
};

const remove = function ({collection, id}) {
  const file = init({collection, id});

  return file.remove()

};

const list = function (collection) {
  const dir = init({collection});

  return dir.list()
    .then(list => list.map(e => e.trim().replace('.json', '')))
};

module.exports = {create, read, update, remove, list};