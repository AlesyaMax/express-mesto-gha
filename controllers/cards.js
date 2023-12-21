const Card = require("../models/card");
const NotFoundError = require("../utils/NotFoundError");

module.exports.createCard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: userId });
    return res.status(201).send(newCard);
  } catch (error) {
    switch (error.name) {
      case "ValidationError":
        return res.status(400).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      default:
        return res.status(500).send({
          message: "На сервере произошла ошибка",
        });
    }
  }
};

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (error) {
    return res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const cardToDelete = await Card.findByIdAndDelete(req.params.cardId).orFail(
      () => new NotFoundError("Карточка с указанным _id не найдена"),
    );
    return res.status(200).send(`Карточка ${cardToDelete._id}успешно удалена`);
  } catch (error) {
    switch (error.name) {
      case "CastError":
        return res.status(404).send("Карточка с указанным _id не найдена");
      case "NotFoundError":
        return res.status(error.statusCode).send(error.message);
      default:
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const updatedLikes = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new NotFoundError("Передан несуществующий _id карточки"));
    return res.status(200).send(updatedLikes);
  } catch (error) {
    switch (error.name) {
      case "CastError":
        return res
          .status(400)
          .send("Переданы некорректные данные для постановки лайка");
      case "NotFoundError":
        return res.status(error.statusCode).send(error.message);
      default:
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const updatedLikes = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new NotFoundError("Передан несуществующий _id карточки"));
    return res.status(200).send(updatedLikes);
  } catch (error) {
    switch (error.name) {
      case "CastError":
        return res
          .status(400)
          .send("Переданы некорректные данные для снятия лайка");
      case "NotFoundError":
        return res.status(error.statusCode).send(error.message);
      default:
        return res.status(500).send({ message: "На сервере произошла ошибка" });
    }
  }
};
