const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (u) => isURL(u),
      message: 'Некорректный URL адрес',
    },
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    // пользователь не нашёлся — отклоняем промис
    if (!user) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    // нашёлся — сравниваем хеши
    return bcrypt.compare(password, user.password).then((matched) => {
      // хеши не совпали — отклоняем промис
      if (!matched) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      // аутентификация успешна
      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
