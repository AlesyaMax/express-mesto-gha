const jwt = require('jsonwebtoken');
const AuthError = require('../utils/AuthError');
const { SECRET_KEY } = require('../config');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new AuthError('Неправильные почта или пароль');
    }
    const validToken = token.replace('jwt=', '');
    payload = jwt.verify(validToken, SECRET_KEY);
  } catch (error) {
    next(new AuthError('Необходимо авторизоваться'));
  }
  req.user = payload;

  next();
};
