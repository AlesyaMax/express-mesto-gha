const router = require('express').Router();
const {
  getUsers,
  getUserById,
  editUserInfo,
  editAvatar,
  deleteUserById,
  getUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', getUserById);

router.patch('/me', editUserInfo);
router.patch('/me/avatar', editAvatar);

router.delete('/:userId', deleteUserById);

module.exports = router;
