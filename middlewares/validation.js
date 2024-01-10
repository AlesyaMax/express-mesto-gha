const { celebrate, Joi } = require('celebrate');
const { REGEX_URL, REGEX_ID } = require('../config');

const validateNewCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(REGEX_URL),
  }),
});

const validateCurrentCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().regex(REGEX_ID),
  }),
});

const validateCurrentUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().regex(REGEX_ID),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(REGEX_URL),
  }),
});

module.exports = {
  validateNewCard,
  validateCurrentCard,
  validateCurrentUser,
  validateUserInfo,
  validateUserAvatar,
};
