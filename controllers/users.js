const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const CreateError = require('../errors/CreateError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// Получение users
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};
// Получение user по id
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch(next);
};

// возвращает информацию о текущем user
module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => {
    // проверяем, есть ли user с таким id
    if (!user) {
      return next(new NotFoundError('Пользователь не найден.'));
    }
    // возвращаем user, если он есть
    return res.send(user);
  }).catch(next);
};

// Создание нового user
module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Неправильный логин или пароль.');
  }
  return User.findOne({ email }).then((user) => {
    if (user) {
      throw new CreateError(`Пользователь с ${email} уже существует.`);
    }
    return bcrypt.hash(password, 10);
  })
    .then((hash) => User.create({
      email,
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неккоректные данные.'));
      }
      return next(err);
    });
};

// Аутентификация user
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // проверим существует ли такой email или пароль
      if (!user || !password) {
        return next(new BadRequestError('Неверный email или пароль.'));
      }
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'f4c54c27ef2ba51e73c7d9cc84812fa30dc0edaac11e5e77011ccc2365248253',
        {
          expiresIn: '7d',
        },
      );

      // вернём токен
      return res.send({ token });
    })
    .catch(next);
};

// Обновление информации о user
module.exports.setUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Неверный тип данных.'));
      }
      return next(err);
    });
};
// Обновление user-avatar
module.exports.setAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Неверная ссылка'));
      }
      return next(err);
    });
};
