const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const path = require('path');
const router = require('./app/router');
const helpers = require('./app/helpers');

const startServer = function () {

};


const server = http.createServer(function (req, res) {
  const reqData = url.parse(req.url, true);
  //console.log(reqData, req)
  const path = reqData.pathname.replace(/^\/+|\/+$/g,'');
  const query = reqData.query;
  const method = req.method.toLowerCase();

  req.on('data', function (data) {
    debugger
  });
  
  req.on('end', function () {
    let handler = router[path] && router[path][method] ? router[path][method] : router.notFound;

    const requestData = {
      path, method
    };

    handler(req, res, requestData)
      .then(function (data) {
        const statusCode = typeof(data.statusCode) === 'number' ? data.statusCode : 200;
        const response = typeof(data.response) === 'object' ? data.response : {};

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(JSON.stringify(response));
      })
      .catch(function (e) {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end('the error has been logged to the system');

        const errorMsg = 'An error occurred trying to send response. A 500 error has been sent to requester.';

        // @TODO log error to file
        console.log(errorMsg, e)
      })
  })

});

server.listen(5000, function () {
  console.log('Server listening at port 5000')
});


