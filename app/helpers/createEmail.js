const createEmail = function (data) {
  return `Your order has been placed: 

        ${data.items.reduce(function (text, item) {
          return text + `
          ${item.amount} ${item.name} - ${item.price}`
        }, '')}
    
    Your payment of ${data.total} has been succesfully process`;

};

module.exports = createEmail;