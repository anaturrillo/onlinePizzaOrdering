const _data = require('./data');

const log = function (e) {
  console.log(e);
  return _data.create({
    collection: 'logs',
    item: e,
    id: Date.now().toString()
  })
};


module.exports = log;