const jwt = require('jsonwebtoken');
require('dotenv').config();
const Error401 = require('../errors/error401');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
    next(new Error401('Необходима авторизация'));
  }

  // const jwtq = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
    // res.send({ payload });
  } catch (err) {
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
      next(new Error401('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
