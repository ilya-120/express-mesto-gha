const router = require('express').Router();
const {
  userIdValidation,
  updateUserValidation,
  updateAvatarValidation,
} = require('../middlewares/validations');

const {
  getUser,
  getCurrentUser,
  getUsers,
  setUser,
  setAvatar,
} = require('../controllers/users');

router.get('/users/:userId', userIdValidation, getUser);

router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

router.patch('/users/me', updateUserValidation, setUser);

router.patch('/users/me/avatar', updateAvatarValidation, setAvatar);

module.exports = router;
