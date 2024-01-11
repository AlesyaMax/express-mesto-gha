const mongoose = require('mongoose');
const Card = require('../models/card');
const AccessError = require('../utils/AccessError');
const NotFoundError = require('../utils/NotFoundError');
const ValidationError = require('../utils/ValidationError');
const { updateCard } = require('../middlewares/search');

module.exports.createCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: userId });
    return res.send(newCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError(error.message));
    }
    next(error);
  }
};

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const cardToDelete = await Card.findById(req.params.cardId).orFail(
      () => new NotFoundError('Карточка с указанным _id не найдена'),
    );
    if (req.user._id !== `${cardToDelete.owner}`) {
      throw new AccessError('Нет прав на удаление карточки');
    } else {
      await cardToDelete.deleteOne();
      return res.status(200).send({
        message: `Карточка ${cardToDelete._id} успешно удалена`,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.likeCard = (req, res, next) => {
  const newData = { $addToSet: { likes: req.user._id } };
  return updateCard(req, res, next, newData);
};

module.exports.dislikeCard = (req, res, next) => {
  const newData = { $pull: { likes: req.user._id } };
  return updateCard(req, res, next, newData);
};
