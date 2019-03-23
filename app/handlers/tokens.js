const createToken = function (data) {
  const email = _validate.email(data.query.email);
  const token = data.headers.token;

  if (!email) return Promise.resolve(createError(400, 'createUser', 'missing required fields', data));

  const specs = {
    collection: 'tokens',
    id: email,
    item: {name, address, email}
  };

  return _data.create(specs)
};

module.exports = {createToken};