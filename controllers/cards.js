const Card = require('../model/card');

const ERR_BAD_REQUEST = 400;
const ERR_NOT_FOUND = 404;
const ERR_DEFAULT = 500;

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch(() => res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' }));

const createCard = (req, res) => {
  const { name, link } = req.body; // получим из объекта запроса имя и описание пользователя
  // const olo = req.user;
  const { _id } = req.user;
  // return Card.create({ name, link, owner: _id})
  //   .then((card) => res.send({ data: card }))
  // // return User.findOne({ _id })
  // .then((user) => {
  //   if (!user) {
  //     return Promise.reject(new Error('Нет пользователя с таким id'));
  //   }
  //   res.status(200).send(user);
  // })

  return Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findById({ _id: req.params.cardId })
    .orFail(new Error('NotValidId'))
  // .then(() => res.send({ message: 'Карточка удалена' }))
    .then((card) => {
      //   // Надо проверить может ли пользователь удалить эту карточку
      //   // user._id приходит с типом string, а card.owner._id приходит с форматом object
      //   // необходимо привести к строке
      if (req.user._id !== card.owner.toString()) {
      // Бросаем ошибку, что пользователь не может это делать
      // next(new Error403("Нельзя удалить чужую карточку"));
        res.status(505)
          .send({ message: 'Влажно' });
        return Promise.reject(new Error('Нельзя удалить чужую карточку'));
      }
      card.remove();
      res.status(200)
        .send({ message: `Карточка с id ${card.id} успешно удалена!` });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

// const deleteCard = (req, res, next) => {
//   // найдём карточку и удалим её
//   Card.findById(req.params.cardId)
//     .orFail(() => {
//       // Если мы здесь, значит запрос в базе ничего не нашёл
//       // Бросаем ошибку и попадаем в catch
//       throw new Error404("Карточка с заданным ID отсутствует в базе данных");
//     })
//     .then((card) => {
//       // Надо проверить может ли пользователь удалить эту карточку
//       // user._id приходит с типом string, а card.owner._id приходит с форматом object
//       // необходимо привести к строке
//       if (req.user._id !== card.owner.toString()) {
//         // Бросаем ошибку, что пользователь не может это делать
//         next(new Error403("Нельзя удалить чужую карточку"));
//       } else {
//         card.remove();
//         res.status(200)
//           .send({ message: `Карточка с id ${card.id} успешно удалена!` });
//       }
//     })
//     // .catch((err) => {
//     //   if (err.name === "CastError") {
//     //     next(new Error400("Ошибка в формате ID карточки"));
//     //   } else if (err.statusCode === ERROR_NOT_FOUND) {
//     //     next(err);
//     //   } else {
//     //     next(new Error500("Что-то пошло не так :("));
//     //   }
//     // });
// };

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
