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

function cacheCurrentUser(func) {
  const cache = new Map();
  return function (req, res, next, currentUserId) {
    if (cache.has(currentUserId)) {
      return cache.get(currentUserId);
    }
    const result = func(req, res, next, currentUserId);
    cache.set(currentUserId, result);
    return result;
  };
}

function cacheUser(func) {
  const cache = new Map();
  return function (req, res, next, userId) {
    if (cache.has(userId)) {
      return cache.get(userId);
    }
    const result = func(req, res, next, userId);
    cache.set(userId, result);
    return result;
  };
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

function cacheUserInfo(func) {
  const cache = new Map();
  return function (req, res, next, userData) {
    if (cache.has(userData)) {
      return cache.get(userData);
    }
    const result = func(req, res, next, userData);
    cache.set(userData, result);
    return result;
  };
}

function cacheAvatar(func) {
  const cache = new Map();
  return function (req, res, next, avatarData) {
    if (cache.has(avatarData)) {
      return cache.get(avatarData);
    }
    const result = func(req, res, next, avatarData);
    cache.set(avatarData, result);
    return result;
  };
}

const findCurrentUser = cacheCurrentUser(findUser);
const findAnyUser = cacheUser(findUser);
const updateUserInfo = cacheUserInfo(updateUser);
const updateAvatar = cacheAvatar(updateUser);

module.exports = {
  findCurrentUser,
  findAnyUser,
  updateUserInfo,
  updateAvatar,
};
