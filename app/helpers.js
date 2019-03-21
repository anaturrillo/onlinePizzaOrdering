
const createError = function (sender) {
  return function (msg) {
    return {
      error: msg,
      failedAt: sender
    }
  }
};



module.exports = {createError};