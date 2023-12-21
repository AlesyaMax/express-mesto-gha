const User = require("../models/user");
const NotFoundError = require("../utils/NotFoundError");

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new NotFoundError("Пользователь с указанным _id не найден"),
    );
    return res.status(200).send(user);
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
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    return res.status(201).send(newUser);
  } catch (error) {
    switch (error.name) {
      case "ValidationError":
        return res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      default:
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
  }
};

module.exports.editUserInfo = async (req, res) => {
  try {
    const { newName, newAbout } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        name: newName,
        about: newAbout,
      },
      { new: true },
    ).orFail(() => new NotFoundError("Пользователь с указанным _id не найден"));
    return res.status(200).send(updatedUser);
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
    const { newAvatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        avatar: newAvatar,
      },
      { new: true },
    ).orFail(() => new NotFoundError("Пользователь с указанным _id не найден"));
    return res.status(200).send(updatedUser);
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
