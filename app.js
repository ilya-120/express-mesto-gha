const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
});

app.use((req, res, next) => {
  req.user = {
    _id: '629f3199998145b03fd442aa',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`сервер работает на порту ${PORT}`);
});
