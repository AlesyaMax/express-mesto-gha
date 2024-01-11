const mongoose = require('mongoose');
const User = require('../models/user');
const NotFoundError = require('../utils/NotFoundError');
const ValidationError = require('../utils/ValidationError');

async function findUser(req, res, next, id) {
  try {
    const user = await User.findById(id).orFail(
      () => new NotFoundError('Пользователь с указанным _id не найден'),
    );
    return user;
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next, data) {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
      runValidators: true,
    }).orFail(
      () => new NotFoundError('Пользователь с указанным _id не найден'),
    );
    return updatedUser;
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(
        new ValidationError('Переданы некорректные данные пользователя'),
      );
    }
    next(error);
  }
}

module.exports = {
  findUser,
  updateUser,
};
