module.exports = {
  "notFound":function (req, res, reqData){
    return new Promise(function (resolve, reject) {
      const response = {
        statusCode: 404,
        response: {msg:'recurso no encontrado: ' + reqData.method.toUpperCase() + ' /' + reqData.path}
      };
      resolve(response);
    })
  },
  "users": {
    "get": function () {
      
    },
    "post": function (req, res) {
      
    }
  }
};