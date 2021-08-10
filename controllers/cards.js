const Card = require('../model/card');
const Error400 = require('../errors/error400');
const Error403 = require('../errors/error403');
const Error404 = require('../errors/error404');

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch((err) => next(err));

const createCard = (req, res, next) => {
  const { name, link } = req.body; // получим из объекта запроса имя и описание пользователя
  const { _id } = req.user;
  return Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error400('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById({ _id: req.params.cardId })
    .orFail(() => {
      throw new Error404('Запрашиваемая карточка не найдена');
    })
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        throw new Error403('Нельзя удалить чужую карточку');
      }
      card.remove();
      res.status(200)
        .send({ message: `Карточка с id ${card.id} успешно удалена!` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Переданы некорректные данные'));
      }
      next(err);
    });
};

const putLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail(() => {
    throw new Error404('Запрашиваемая карточка не найдена');
  })
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new Error400('Переданы некорректные данные для постановки лайка'));
    }
    next(err);
  });

const deleteLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new Error404('Запрашиваемая карточка не найдена');
  })
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new Error400('Переданы некорректные данные для снятия лайка'));
    }
    next(err);
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
