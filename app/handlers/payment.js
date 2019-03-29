const https = require('https');
const _formatError  = require('./../helpers').formatError;
const createResponse = require('./../helpers').createResponse;
const _data = require('./../data');
const querystring = require('querystring');
const _validate = require('./../helpers/validate');
const errorToObject = require('./../helpers').errorToObject;
const config = require('./../config');
const createEmail = require('./../helpers/createEmail');
const _catchError = require('./../helpers').catchError;

const pay = function (data) {
  const path = `${data.method} /${data.path}`;
  const cartId = data.body.email;
  const paymentToken = data.headers.payment_token;
  const token = data.headers.token;
  const email = data.body.email;

  if(!cartId) return Promise.resolve(_formatError(400, path, 'Missing cartId', null, null ));
  if(!paymentToken) return Promise.resolve(_formatError(400, path, 'Missing paymentToken', null, null));
  if(!token) return Promise.resolve(_formatError(400, path, 'Missing token', null, null));
  if(!email) return Promise.resolve(_formatError(400, path, 'Missing email', null, null));

  const getCart = _ => _data.read({collection:'carts', id:cartId});

  const getItems = function ([cart, _]) {
    
    if (!Array.isArray(cart.items)) throw _formatError(400, 'calculate amount', 'There are no items in the cart', {}, {})

    const getCartItems = cart.items.map(function (cartItem) {
      return _data.read({collection:'menu', id:cartItem.itemId})
        .then(function ([menuItem, _]) {
          return Object.assign(cartItem, menuItem)
        })
    });

    return Promise.all(getCartItems)
  };

  const addAmounts = function (total, item) {
    return total + item.price * item.amount
  };

  const calculateAmount = function (items) {
    if (!Array.isArray(items)) throw _formatError(400, 'calculate amount', 'There are no items in the cart', {}, {})
    return Promise.all([
      items.reduce(addAmounts, 0)*100,
      items
    ])
  };

  const sendPayment = function ([amount, items]) {
    const reqData = {
      amount,
      source: paymentToken,
      currency: "usd",
      description: "cartId: " + cartId
    };

    const stringReqData = querystring.stringify(reqData);

    const requestDetails = {
      protocol: 'https:',
      hostname: 'api.stripe.com',
      method: 'POST',
      path: '/v1/charges',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringReqData),
        'Authorization': config.paymentApiKey
      }
    };
    
    const requestPromise = new Promise(function (resolve, reject) {

      const req = https.request(requestDetails, function (res) {
        const status = res.statusCode;
        if (status === 200 || status === 201) {
          resolve()
        } else {
          reject(_formatError(500, path, `Unable to process payment. Request responded: ${status}`, {responseMsg: res.statusMessage}, {}))
        }
      });

      req.on('error', function (e) {
        reject(_formatError(500, path, 'Unable to process payment', {response: e}, {}))
      });

      req.write(stringReqData);

      req.end()
    });

    return Promise.all([requestPromise, items, amount])
  };

  const sendEmail = function ([sendRequestPayment, items, amount]) {

    const order = {
      total: amount/100 + ' USD',
      user: email,
      items: items
        .map(function (item) {
          return {
            amount: item.amount,
            name: item.name,
            description:item.description,
            price: item.price + ' USD'
          }
        })
    };

    const requestData = {
      from: 'Excited User <Ani@sandbox466a2d00c6a947b9bb9a2ed257b0b986.mailgun.org>',
      to: email,
      subject: 'Your order has been placed!',
      text: createEmail(order)
    };

    const stringRequestData = querystring.stringify(requestData);

    const requestDetails = {
      protocol: 'https:',
      hostname: 'api.mailgun.net',
      method: 'POST',
      path: `/v3/${config.mailDomain}/messages`,
      auth: `api:${config.mailApiKey}`,
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringRequestData)
      }
    };

    const requestPromise = new Promise(function (resolve, reject) {

      const req = https.request(requestDetails, function (res) {
        const status = res.statusCode;
        if (status === 200 || status === 201) {
          resolve(createResponse(200, 'Payment has been processed and user has been notified via email', order))
        } else {
          resolve(_formatError(500, path, `Unable to send email. Request responded: ${status}`, {responseMsg: res.statusMessage}, {}))
        }
      });

      req.write(stringRequestData);

      req.on('error', function (e) {
        resolve(_formatError(500, path, 'Unable to send email.', e, {}))
      });

      req.end()
    });

    return requestPromise;
  };

  return _validate.token(token, email)
    .then(getCart)
    .then(getItems)
    .then(calculateAmount)
    .then(sendPayment)
    .then(sendEmail)
    .catch(_catchError('Unable to update user', data))
};

module.exports = {pay};