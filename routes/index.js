const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const Error404 = require('../errors/error404');

router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res, next) => {
  next(new Error404('Запрашиваемый ресурс не найден.'));
});

module.exports = router;
