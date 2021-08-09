const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Error400 = require('../errors/error400');
const Error401 = require('../errors/error401');
const Error404 = require('../errors/error404');
const Error409 = require('../errors/error409');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const ERR_BAD_REQUEST = 400;
const ERR_NOT_FOUND = 404;
const ERR_DEFAULT = 500;

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch(() => res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' }));

const getUser = (req, res, next) => {
  User.findById({ _id: req.params.userId })
    .orFail(() => {
      throw new Error404('Запрашиваемый пользователь не найден');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Переданы некорректные данные'));
      }
    });
};

const createUser = (req, res, next) => {
  // получим из объекта запроса имя и описание пользователя
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    // .then((user) => res.send({ data: user }))
    // .catch((err) => res.status(400).send(err));
  // };
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error400('Переданы некорректные данные при создании пользователя'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new Error409('Данный email уже зарегистрирован'));
      }
    });
};
// .catch(next);
// .catch((err) => {
//   if (err.name === 'ValidationError') {
//     res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
//   } else if (err.name === 'MongoError' && err.code === 11000) {
//     // Обработка ошибки
//     throw new Error400('Нет пользователя с таким id');
//   } else {
//     res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
//   }
// });

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

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
  // .select("+password")
    .then((user) => {
      if (!user) {
        // throw new NotFoundUserError("Неправильные почта или пароль");
        // new Error('Неправильные почта или пароль')
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // throw new NotFoundUserError("Неправильные почта или пароль");
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET
              : 'some-secret-key',
            { expiresIn: '7d' },
          );
          // res.send({ token });
          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          })
            .status(201).send({
              message: 'Аутентификация прошла успешно',
            });
        });
    })
    .catch(next);
};

const aboutUser = (req, res) => {
  const { _id } = req.user;
  return User.findOne({ _id })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Нет пользователя с таким id'));
      }
      res.status(200).send(user);
    });
  // .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  aboutUser,
};
