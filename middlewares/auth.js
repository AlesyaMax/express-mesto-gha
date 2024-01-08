const jwt = require('jsonwebtoken');
const AuthError = require('../utils/AuthError');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.cookie;
    if (!token) {
      throw new AuthError('Что-то не так с токеном');
    }
    const validToken = token.replace('jwt=', '');
    payload = jwt.verify(validToken, 'dev_secret');
  } catch (error) {
    switch (error.name) {
      case 'AuthError':
        return res.status(error.statusCode).send({ message: error.message });
      default:
        return res.status(500).send({ message: error.message });
    }
  }
  req.user = payload;

  next();
};
