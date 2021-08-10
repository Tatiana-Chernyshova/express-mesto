const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const loginRouter = require('./login');
const Error404 = require('../errors/error404');

router.use('/', loginRouter);
router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res, next) => {
  next(new Error404('Запрашиваемый ресурс не найден.'));
});

module.exports = router;
