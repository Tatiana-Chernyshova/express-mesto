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
  },
  owner: {
    type: ObjectId,
  },
  likes: {
    type: Array,
  },
  createdAt: {
    type: Date,
  }
});

module.exports = mongoose.model('card', cardSchema);


// owner — ссылка на модель автора карточки, тип ObjectId, обязательное поле;
// likes — список лайкнувших пост пользователей, массив ObjectId, по умолчанию — пустой массив (поле default);
// createdAt — дата создания, тип Date, значение по умолчанию Date.now.
String // строка
Number // число
Date // дата
Boolean // логическое: true или false
Array // массив