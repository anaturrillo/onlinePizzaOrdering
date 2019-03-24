const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const path = require('path');
const router = require('./app/router');
const helpers = require('./app/helpers/index');
const _log = require('./app/log');

const server = http.createServer(function (req, res) {
  const reqData = url.parse(req.url, true);
  //console.log(reqData, req)
  const path = reqData.pathname.replace(/^\/+|\/+$/g,'');
  const query = reqData.query;
  const method = req.method.toLowerCase();
  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', function (data) {
    buffer += decoder.write(data);
  });
  
  req.on('end', function () {
    buffer += decoder.end();
    const body = helpers.parseJsonToObject(buffer);

    let handler = router[path] && router[path][method] ? router[path][method] : router.notFound;

    const requestData = { path, method: method.toUpperCase(), body , query, headers};

    handler(requestData)
      .then(function (data) {
        const statusCode = typeof(data.statusCode) === 'number' ? data.statusCode : 200;
        const response = typeof(data.response) === 'object' ? data.response : {};

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(JSON.stringify(response));
      })
      .catch(_log)
      .catch(console.error)
  });

  req.on('error', function (a) {
    console.log('error en req', a);
    debugger
  })
});

server.listen(5000, function () {
  console.log('\x1b[33m%s\x1b[0m', 'Server listening at port 5000')
});


