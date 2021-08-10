const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatar, aboutUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const validateUrl = require('../validator/validateUrl');

router.use(auth);
router.get('/', getUsers);
router.get('/me', aboutUser); // возвращает информацию о текущем пользователе
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser); // обновляет профиль
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateUrl),
  }),
}), updateAvatar); // обновляет аватар

module.exports = router;
