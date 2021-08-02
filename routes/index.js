const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.get('*', function(req, res, next) {

  err = { “message”: 'Запрашиваемый ресурс не найден'  }

  if(err) next(err);

  if(!err){
    res.render('index', { title: 'Express' });
  }

});

module.exports = router;
