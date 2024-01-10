const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../utils/NotFoundError');
const AuthError = require('../utils/AuthError');
const ValidationError = require('../utils/ValidationError');
const { generateToken } = require('../utils/config');
const DuplicateError = require('../utils/DuplicateError');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new NotFoundError('Пользователь с указанным _id не найден'),
    );
    return res.send(user);
  } catch (error) {
    next(error);
  }
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
    if (error.name === 'ValidationError') {
      return next(new ValidationError(error.message));
    }
    next(error);
  }
};

module.exports.editUserInfo = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        name,
        about,
      },
      { new: true, runValidators: true },
    ).orFail(() => new NotFoundError('Пользователь с указанным _id не найден'));
    return res.send(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(
        new ValidationError('Переданы некорректные данные пользователя'),
      );
    }
    next(error);
  }
};

module.exports.editAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        avatar,
      },
      { new: true, runValidators: true },
    ).orFail(() => new NotFoundError('Пользователь с указанным _id не найден'));
    return res.send(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(
        new ValidationError('Переданы некорректные данные пользователя'),
      );
    }
    next(error);
  }
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
  try {
    const { email } = req.user;
    const user = await User.findOne({ email }).orFail(
      () => new NotFoundError('Пользователь не найден'),
    );
    return res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
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
