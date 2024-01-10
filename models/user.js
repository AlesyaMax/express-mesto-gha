const mongoose = require('mongoose');
const validator = require('validator');
const {
  REGEX_URL,
  DEFAULT_USER_NAME,
  DEFAULT_ABOUT,
  DEFAULT_AVATAR,
} = require('../config');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: DEFAULT_USER_NAME,
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: DEFAULT_ABOUT,
    },
    avatar: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      default: DEFAULT_AVATAR,
      match: REGEX_URL,
    },
    email: {
      type: String,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректно указана почта',
      },
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      select: false,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
