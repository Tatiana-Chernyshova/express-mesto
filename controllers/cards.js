const Card = require('../model/card');

const ERR_BAD_REQUEST = 400;
const ERR_NOT_FOUND = 404;
const ERR_DEFAULT = 500;

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch(() => res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' }));

const createCard = (req, res) => {
  const { name, link } = req.body; // получим из объекта запроса имя и описание пользователя
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

const deleteCard = (req, res) => Card.findByIdAndRemove({ _id: req.params.cardId })
  .orFail(new Error('NotValidId'))
  .then(() => res.send({ message: 'Карточка удалена' }))
  .catch((err) => {
    if (err.message === 'NotValidId') {
      res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
    } else if (err.name === 'CastError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
    }
  });

const putLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail(new Error('NotValidId'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.message === 'NotValidId') {
      res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
    } else if (err.name === 'CastError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
    } else {
      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
    }
  });

const deleteLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('NotValidId'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.message === 'NotValidId') {
      res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
    } else if (err.name === 'CastError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятии лайка' });
    } else {
      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
    }
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
