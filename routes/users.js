const router = require('express').Router();
const {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, aboutUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);
router.get('/', getUsers);
router.get('/me', aboutUser); // возвращает информацию о текущем пользователе
router.get('/:userId', getUser);
router.patch('/me', updateUser); // обновляет профиль
router.patch('/me/avatar', updateAvatar); // обновляет аватар

module.exports = router;
