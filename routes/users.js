const router = require('express').Router();
const {
  createUser,
  getUser,
  getUsers,
  setUser,
  setAvatar,
} = require('../controllers/users');

router.post('/users', createUser);

router.get('/users/:userId', getUser);

router.get('/users', getUsers);

router.patch('/users/me', setUser);

router.patch('/users/me/avatar', setAvatar);

module.exports = router;
