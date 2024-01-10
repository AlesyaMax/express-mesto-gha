const PORT = 3000;
const DB_URL = 'mongodb://localhost:27017/mestodb';

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const SECRET_KEY = 'dev_secret';

const REGEX_ID = /[0-9a-f]{24}/;
const REGEX_URL = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

const DEFAULT_USER_NAME = 'Жак-Ив Кусто';
const DEFAULT_ABOUT = 'Исследователь';
const DEFAULT_AVATAR = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';

module.exports = {
  PORT,
  DB_URL,
  MONGO_DUPLICATE_ERROR_CODE,
  SALT_ROUNDS,
  SECRET_KEY,
  REGEX_URL,
  REGEX_ID,
  DEFAULT_USER_NAME,
  DEFAULT_ABOUT,
  DEFAULT_AVATAR,
};
