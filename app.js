const express = require('express');
const app = express();
const path = require('path');
const rootRouter = require('./routes/users');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
}); 
app.use(express.static(path.resolve(__dirname, 'public')));
// app.use(express.static(path.join('/index.html', 'public')));
app.use(express.json());
app.use('/users', rootRouter);


app.listen(3000, () => {
  console.log('zapysk!!!')
});


// mongodb://localhost:27017/mestodb