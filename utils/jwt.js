const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

module.exports.generateToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
