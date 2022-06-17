const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  NOT_FOUND,
  errorHandler,
} = require('../utils/errors');

// Получение users
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => errorHandler(err, res));
};
// Получение user по id
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => errorHandler(err, res));
};

// возвращает информацию о текущем user
module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => {
    // проверяем, есть ли user с таким id
    if (!user) {
      return Promise.reject(new Error('Пользователь не найден.'));
    }
    // возвращаем user, если он есть
    return res.send(user);
  }).catch((err) => {
    next(err);
  });
};

// Создание нового user
module.exports.createUser = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => errorHandler(err, res));
};

// Аутентификация user
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        {
          expiresIn: '7d',
        },
        'f4c54c27ef2ba51e73c7d9cc84812fa30dc0edaac11e5e77011ccc2365248253',
      );

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      // возвращаем ошибку аутентификации
      res.status(401).send({ message: err.message });
    });
};

// Обновление информации о user
module.exports.setUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => errorHandler(err, res));
};
// Обновление user-avatar
module.exports.setAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => errorHandler(err, res));
};
