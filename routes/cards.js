const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards); // возвращает все карточки
router.post('/', createCard); // создаёт карточку
router.delete('/:cardId', deleteCard); // удаляет карточку по идентификатору
router.put('/:cardId/likes', putLike); // поставить лайк карточке
router.delete('/:cardId/likes', deleteLike); // убрать лайк с карточки

module.exports = router;
