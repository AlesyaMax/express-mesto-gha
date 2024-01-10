const router = require('express').Router();
const {
  getUsers,
  getUserById,
  editUserInfo,
  editAvatar,
  // deleteUserById,
  getUser,
} = require('../controllers/users');
const {
  validateCurrentUser,
  validateUserInfo,
  validateUserAvatar,
} = require('../middlewares/validation');

router.get('/users', getUsers);
router.get('/users/me', getUser);
router.get('/users/:userId', validateCurrentUser, getUserById);

router.patch('/users/me', validateUserInfo, editUserInfo);
router.patch('/users/me/avatar', validateUserAvatar, editAvatar);

// router.delete('/users/:userId', deleteUserById);

module.exports = router;
