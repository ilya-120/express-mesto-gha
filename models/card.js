const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validator: (v) => /^(https?:\/\/)(www\.)?([a-zA-Z0-9._]+)\.([a-z]{2,6}\.?)(\/[\w-._~:/?#[@!$&'()*+,;=]*)*\/?#?$/i.test(v),
    message: 'Некорректный URL адрес',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
