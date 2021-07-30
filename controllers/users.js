const User = require('../model/user');
const ERR_BAD_REQUEST = 400;
const ERR_NOT_FOUND = 404;
const ERR_DEFAULT = 500;

const getUsers = (req, res) => {
  return User.find({})
    .then(users => res.status(200).send({data: users}))
    .catch(err => res.status(ERR_DEFAULT).send({ message: "Что-то пошло не так" }))
}

const getUser = (req, res) => {
  return User.findById({_id: req.params.userId})
    .then(user => res.status(200).send({data: user}))
    .catch(err => {
      if (err.statusCode === ERR_NOT_FOUND) {
        res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса имя и описание пользователя
  return User.create({ name, about, avatar })
    .then(user => res.status(200).send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });

};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then(user => res.status(200).send({ data: user }))
    .catch(err => {
      if (err.statusCode === ERR_NOT_FOUND) {
        res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if  (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при редактировании пользователя' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then(user => res.status(200).send({ data: user }))
    .catch(err => {
      if (err.statusCode === ERR_NOT_FOUND) {
        res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'ValidationError') {
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
  updateAvatar
};
