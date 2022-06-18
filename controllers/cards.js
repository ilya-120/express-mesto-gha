const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenAccessError = require('../errors/ForbiddenAccessError');
const NotFoundError = require('../errors/NotFoundError');

// Получение cards
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};
// Создание card
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы неверные данные.'));
      }
      return next(err);
    });
};
// Удаление card
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card отсутствует.');
      }
      if (card.owner.valueOf() !== _id) {
        throw new ForbiddenAccessError('Нельзя удалять чужую card!');
      }
      Card.findByIdAndRemove(cardId)
        .then((deleteCard) => res.send(deleteCard))
        .catch(next);
    })
    .catch(next);
};
// Добавить лайк
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Card отсутствует.'));
      }
      return res.send(card);
    })
    .catch(next);
};
// Удалить лайк
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Card отсутствует.'));
      }
      return res.send(card);
    })
    .catch(next);
};
