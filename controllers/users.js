const bcrypt = require("bcryptjs");
const User = require("../models/user");
const NotFoundError = require("../utils/NotFoundError");
const AuthError = require("../utils/AuthError");
const { generateToken } = require("../utils/jwt");

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new NotFoundError("Пользователь с указанным _id не найден")
    );
    return res.send(user);
  } catch (error) {
    switch (error.name) {
      case "CastError":
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные пользователя" });
      case "NotFoundError":
        return res.status(error.statusCode).send({ message: error.message });
      default:
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar, email, password } = req.body;
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
      return res
        .status(400)
        .send({ message: "Такой пользователь уже существует" });
    }
    switch (error.name) {
      case "ValidationError":
        return res.status(400).send({
          message: error.message,
        });
      default:
        return res.status(500).send({ message: error.message });
    }
  }
};

module.exports.editUserInfo = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        name,
        about,
      },
      { new: true, runValidators: true }
    ).orFail(() => new NotFoundError("Пользователь с указанным _id не найден"));
    return res.send(updatedUser);
  } catch (error) {
    switch (error.name) {
      case "CastError":
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные пользователя" });
      case "ValidationError":
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      case "NotFoundError":
        return res.status(error.statusCode).send({ message: error.message });
      default:
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
  }
};

module.exports.editAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        avatar,
      },
      { new: true, runValidators: true }
    ).orFail(() => new NotFoundError("Пользователь с указанным _id не найден"));
    return res.send(updatedUser);
  } catch (error) {
    switch (error.name) {
      case "CastError":
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные пользователя" });
      case "ValidationError":
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      case "NotFoundError":
        return res.status(error.statusCode).send({ message: error.message });
      default:
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
      .select("+password")
      .orFail(() => new AuthError("Неправильные почта или пароль"));
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new AuthError("Неправильные почта или пароль");
    }
    const token = generateToken({ email: user.email, _id: user._id });
    return res
      .status(200)
      .cookie("jwt", token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
      .send({ data: { email: user.email, _id: user._id }, token });
  } catch (error) {
    switch (error.name) {
      case "AuthError":
        return res.status(error.statusCode).send({ message: error.message });
      default:
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email }).orFail(
      () => new NotFoundError("Пользователь не найден")
    );
    return res.status(200).send({ user });
  } catch (error) {
    switch (error.name) {
      case "NotFoundError":
        return res.status(error.statusCode).send({ message: error.message });
      default:
        return res.status(500).send({ message: error.message });
    }
  }
};

module.exports.deleteUserById = async (req, res) => {
  try {
    const userToDelete = await User.findByIdAndDelete(req.params.userId).orFail(
      () =>
        new NotFoundError({ message: "Пользователь с указанным _id не найден" })
    );
    return res.send({
      message: `Пользователь ${userToDelete._id}успешно удален`,
    });
  } catch (error) {
    switch (error.name) {
      case "CastError":
        return res.status(400).send({
          message: "Переданы некорректные данные для удаления пользователя",
        });
      case "NotFoundError":
        return res.status(error.statusCode).send(error.message);
      default:
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
  }
};
