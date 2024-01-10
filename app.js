const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./utils/NotFoundError');
const { PORT, DB_URL, REGEX_URL } = require('./config');
const { cardRouter, userRouter } = require('./routes/index');
const { handleErrors } = require('./middlewares/errors');

const app = express();
app.use(express.json());

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(cookieParser());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(REGEX_URL),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use(auth);

app.use(cardRouter);
app.use(userRouter);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());

app.use(handleErrors);

app.listen(PORT);
