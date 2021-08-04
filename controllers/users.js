const User = require('../model/user');

const ERR_BAD_REQUEST = 400;
const ERR_NOT_FOUND = 404;
const ERR_DEFAULT = 500;

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch(() => res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' }));

const getUser = (req, res) => User.findById({ _id: req.params.userId })
  .orFail(new Error('NotValidId'))
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else if (err.message === 'NotValidId') {
      res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
    } else {
      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
    }
  });

const createUser = (req, res) => {
  // получим из объекта запроса имя и описание пользователя
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при редактировании пользователя' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
