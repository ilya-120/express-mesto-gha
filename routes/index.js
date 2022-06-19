const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { signUp, signIn } = require('../middlewares/validations');

router.post('/signin', signIn, login);
router.post('/signup', signUp, createUser);

router.use(auth);
router.use('/', require('./users'));
router.use('/', require('./cards'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
module.exports = router;
