const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const AuthError = require('../utils/AuthError');
const ValidationError = require('../utils/ValidationError');
const DuplicateError = require('../utils/DuplicateError');
const { generateToken } = require('../utils/jwt');
const { MONGO_DUPLICATE_ERROR_CODE, SALT_ROUNDS } = require('../config');
const {
  findCurrentUser,
  findAnyUser,
  updateUserInfo,
  updateAvatar,
} = require('../middlewares/cache');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;
  const user = await findAnyUser(req, res, next, userId);
  return res.send(user);
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    return res.status(201).send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
      _id: newUser._id,
    });
  } catch (error) {
    if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
      return next(new DuplicateError('Такой пользователь уже существует'));
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError(error.message));
    }
    next(error);
  }
};

module.exports.editUserInfo = async (req, res, next) => {
  const { name, about } = req.body;
  const updatedUser = await updateUserInfo(req, res, next, { name, about });
  return res.send(updatedUser);
};

module.exports.editAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const updatedUser = await updateAvatar(req, res, next, { avatar });
  return res.send(updatedUser);
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
      .select('+password')
      .orFail(() => new AuthError('Неправильные почта или пароль'));
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new AuthError('Неправильные почта или пароль');
    }
    const token = generateToken({ email: user.email, _id: user._id });
    return res
      .status(200)
      .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
      .send({ data: { email: user.email, _id: user._id } });
  } catch (error) {
    next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  const { _id } = req.user;
  const user = await findCurrentUser(req, res, next, _id);
  return res.send(user);
};

// Ниже функция удаления пользователя для доп. проверок, не требуется в проектной работе

// module.exports.deleteUserById = async (req, res, next) => {
//   try {
//     const userToDelete = await User.findByIdAndDelete(req.params.userId).orFail(
//       () => new NotFoundError({ message: 'Пользователь с указанным _id не найден' }),
//     );
//     return res.send({
//       message: `Пользователь ${userToDelete._id}успешно удален`,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
