module.exports = function (body) {
  return {
    json: {
      body: typeof(body) === 'object' ? JSON.stringify(body) : '{}',
      contentType: 'application/json'
    },
    html: {
      body: typeof(body) === 'string' ? body : '',
      contentType: 'text/html'
    },
    ico: {
      body: typeof(body) !== 'undefined' ? body : '',
      contentType: 'image/x-icon'
    },
    css: {
      body: typeof(body) !== 'string' ? body : '',
      contentType: 'text/css'
    },
    png: {
      body: typeof(body) !== 'undefined' ? body : '',
      contentType: 'image/png'
    },
    jpg: {
      body: typeof(body) !== 'undefined' ? body : '',
      contentType: 'image/jpeg'
    },
    plain: {
      body: typeof(body) !== 'undefined' ? body : '',
      contentType: 'text/plain'
    }
  };
};