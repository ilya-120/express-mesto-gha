const router = require('express').Router();
const {
  getUser,
  getCurrentUser,
  getUsers,
  setUser,
  setAvatar,
} = require('../controllers/users');

router.get('/users/:userId', getUser);

router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

router.patch('/users/me', setUser);

router.patch('/users/me/avatar', setAvatar);

module.exports = router;
