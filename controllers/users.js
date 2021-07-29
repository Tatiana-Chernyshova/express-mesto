const User = require('../model/users');

const getUsers = (req, res) => {
  return User.find({})
    .then(users =>
      res.status(200).send({data: users}))
    .catch(err => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Что-то пошло не так" });
      }
    });
}

const getUser = (req, res) => {
  return User.findById({_id: req.params.userId})
    .then(user => {
      res.status(200).send({data: user})})
    .catch(err => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Запрашиваемый пользователь не найден" });
      } else {
        res.status(500).send({ message: "Что-то пошло не так" });
      }
    });
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса имя и описание пользователя
  return User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        // res.status(400).send({ message: "Неверные данные" });
      } else {
        res.status(500).send({ message: "Что-то пошло не так" });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar
};
