const fs = require('fs').promises;

const getUsers = (req, res) => {
  fs.readFile('./data.json')
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
  console.log(req.body)
  // fs.readFile('./data.json')
  fs.readFile('./data.json')
  .then(users => {
    const users2 = JSON.parse(users);
    users2.push(req.body)
    fs.writeFile('./data.json', JSON.stringify(users2))
    // if (!user) return res.status(404).send({message: 'takogo nema'})
    // res.status(200).send(user)
  })}


module.exports = {
  getUsers,
  getUser,
  createUser
};
