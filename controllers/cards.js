const Card = require('../models/card');
const AuthError = require('../utils/AuthError');
const NotFoundError = require('../utils/NotFoundError');

module.exports.createCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: userId });
    return res.send(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: error.message,
      });
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
    const cardToDelete = await Card.findByIdAndDelete(req.params.cardId).orFail(
      () => new NotFoundError({ message: 'Карточка с указанным _id не найдена' }),
    );
    if (req.user._id !== cardToDelete.owner) {
      throw new AuthError('Нет прав на удаление карточки');
    }
    return res.send({
      message: `Карточка ${cardToDelete._id} успешно удалена`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(
      () => new NotFoundError({ message: 'Передан несуществующий _id карточки' }),
    );
    return res.send({ message: 'Лайк добавлен' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные для постановки лайка',
      });
    }
    next(error);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(
      () => new NotFoundError({ message: 'Передан несуществующий _id карточки' }),
    );
    return res.send({ message: 'Лайк удален' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные для снятия лайка',
      });
    }
    next(error);
  }
};
