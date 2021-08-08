const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  // res.send(req.cookies.jwt);
  // res.send('fff');
  // if (!req.cookies.jwt) {
  //   res
  //     .status(201)
  //     .send(JWT_SECRET);
  // }

  if (!token) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  // const jwtq = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
    // res.send({ payload });
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
