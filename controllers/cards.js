const Card = require('../models/card');
const {
  errorHandler, NOT_FOUND,
} = require('../utils/errors');

// Получение cards
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => errorHandler(err, res));
};
// Создание card
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => errorHandler(err, res));
};
// Удаление card
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Отсутствует.' });
      }
      return res.send(card);
    })
    .catch((err) => errorHandler(err, res));
};
// Добавить лайк
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Отсутствует.' });
      }
      return res.send(card);
    })
    .catch((err) => errorHandler(err, res));
};
// Удалить лайк
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Отсутствует.' });
      }
      return res.send(card);
    })
    .catch((err) => errorHandler(err, res));
};
