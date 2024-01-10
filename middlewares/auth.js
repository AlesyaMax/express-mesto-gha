const jwt = require('jsonwebtoken');
const AuthError = require('../utils/AuthError');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.cookie;
    if (!token) {
      throw new AuthError('Неправильные почта или пароль');
    }
    const validToken = token.replace('jwt=', '');
    payload = jwt.verify(validToken, 'dev_secret');
  } catch (error) {
    next(new AuthError('Необходимо авторизоваться'));
  }
  req.user = payload;

  next();
};
