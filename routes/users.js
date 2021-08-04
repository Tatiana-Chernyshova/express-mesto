const router = require('express').Router();
const {
  getUsers, getUser, createUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateUser); // обновляет профиль
router.patch('/me/avatar', updateAvatar); // обновляет аватар

module.exports = router;
