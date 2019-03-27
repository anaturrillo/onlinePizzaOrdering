const fs = require('fs');
const {promisify} = require('util');
const fsOpen = promisify(fs.open);
const fsClose = promisify(fs.close);
const fsWrite = promisify(fs.writeFile);
const fsRead = promisify(fs.readFile);
const fsUnlink = promisify(fs.unlink);
const fsTruncate = promisify(fs.ftruncate);
const fsReadDir = promisify(fs.readdir);

module.exports = {fsOpen, fsClose, fsWrite, fsRead, fsUnlink, fsTruncate, fsReadDir};