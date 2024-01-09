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

router.get(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri({ scheme: ['http://', 'https://'] }),
      email: Joi.string().email().required(),
      password: Joi.string().min(8),
    }),
  }),
  getUsers,
);
router.get(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri({ scheme: ['http://', 'https://'] }),
      email: Joi.string().email().required(),
      password: Joi.string().min(8),
    }),
  }),
  getUser,
);
router.get(
  '/:userId',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri({ scheme: ['http://', 'https://'] }),
      email: Joi.string().email().required(),
      password: Joi.string().min(8),
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
      avatar: Joi.string().uri({ scheme: ['http://', 'https://'] }),
      email: Joi.string().email().required(),
      password: Joi.string().min(8),
    }),
  }),
  editUserInfo,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri({ scheme: ['http://', 'https://'] }),
      email: Joi.string().email().required(),
      password: Joi.string().min(8),
    }),
  }),
  editAvatar,
);

// router.delete('/:userId', deleteUserById);

module.exports = router;
