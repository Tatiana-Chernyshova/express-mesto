const Card = require('../model/cards');

const getCards = (req, res) => {
  return Card.find({})
    .then(cards =>
      res.status(200).send({data: cards}))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const createCard = (req, res) => {
  const { name, link } = req.body; // получим из объекта запроса имя и описание пользователя
  return Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

const deleteCard = (req, res) => {
  return Card.findByIdAndRemove({_id: req.params.cardId})
    .then(card => res.send({ message: `Карточка с id: ${card.id} удалена!` }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};
const putLike = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

const deleteLike = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike
};

