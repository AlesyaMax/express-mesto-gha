const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  validateNewCard,
  validateCurrentCard,
} = require('../middlewares/validation');

router.get('/cards', getCards);
router.post('/cards', validateNewCard, createCard);
router.delete('/cards/:cardId', validateCurrentCard, deleteCard);
router.put('/cards/:cardId/likes', validateCurrentCard, likeCard);
router.delete('/cards/:cardId/likes', validateCurrentCard, dislikeCard);

module.exports = router;
