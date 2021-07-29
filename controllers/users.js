const fs = require('fs').promises;
const User = require('../models/user');

const getUsers = (req, res) => {
  // User.find({ name, about })
  User.find({})
  // fs.readFile('./data.json')
    .then(users => {
      res.status(200).send({data: JSON.parse(users)})
  })
}
const getUser = (req, res) => {
  fs.readFile('./data.json')
  .then(users => {
    const user = JSON.parse(users).find(el => el.id === req.params.userId)
    if (!user) return res.status(404).send({message: 'takogo nema'})
    res.status(200).send(user)
    // res.status(200).send(req.params.userId)
  })}
const createUser = (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса имя и описание пользователя
  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then(user => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));

  // console.log(req.body)
  // fs.readFile('./data.json')
  // fs.readFile('./data.json')
  // .then(users => {
    // const users2 = JSON.parse(users);
    // users2.push(req.body)
    // fs.writeFile('./data.json', JSON.stringify(users2))
    // if (!user) return res.status(404).send({message: 'takogo nema'})
    // res.status(200).send(user)
}; 

PATCH /users/me — обновляет профиль
const updateUser (req, res) => {
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    req.params.id,
    { name: 'Виктор Гусев' },
    // Передадим объект опций:
    {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
        upsert: true // если пользователь не найден, он будет создан
    }
    )
  .then(user => res.send({ data: user }))
  .catch(user => res.send({ "Данные не прошли валидацию. Либо произошло что-то совсем немыслимое" })); ;



PATCH /users/me/avatar — обновляет аватар


// const User = require('../models/user');

// router.post('/', (req, res) => {
//   const { name, about } = req.body; // получим из объекта запроса имя и описание пользователя

//   User.create({ name, about }); // создадим документ на основе пришедших данных
// });


module.exports = {
  getUsers,
  getUser,
  createUser
};
