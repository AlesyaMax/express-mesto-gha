const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUserById,
  editUserInfo,
  editAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.post("/", createUser);

router.patch("/me", editUserInfo);
router.patch("/me/avatar", editAvatar);

module.exports = router;
