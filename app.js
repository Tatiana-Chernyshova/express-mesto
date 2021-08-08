const express = require('express');

const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const rootRouter = require('./routes/index');
// const dotenv =
require('dotenv').config();
// console.log(process.env.NODE_ENV);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cookieParser());
app.use(express.json());
// app.use((req, res, next) => {
//   req.user = {
//     _id: '6102f03c299fc52fe4205d4a', // вставьте сюда _id созданного в предыдущем пункте пользователя
//   };

//   next();
// });
app.use('/', rootRouter);

app.listen(3000, () => console.log(process.env.JWT_SECRET));
