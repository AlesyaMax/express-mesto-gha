const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  editUserInfo,
  editAvatar,
  // deleteUserById,
  getUser,
} = require('../controllers/users');

const regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
const regexId = /[0-1a-f]{24}/;

router.get(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  getUsers,
);
router.get(
  '/me',
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().required(),
    }),
  }),
  getUser,
);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().regex(regexId),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  editUserInfo,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({ avatar: Joi.string().required().regex(regex) }),
  }),
  editAvatar,
);

// router.delete('/:userId', deleteUserById);

module.exports = router;
