const fs = require('fs')
const gToys = require('../data/toy.json')

module.exports = {
  query,
  getById,
  remove,
  save,
}

function query(filterBy) {
  return Promise.resolve(_filter(filterBy))
}

function getById(toyId) {
  const toy = gToys.find((toy) => toy._id === toyId)
  return Promise.resolve(toy)
}

function remove(toyId) {
  const idx = gToys.findIndex((toy) => toy._id === toyId)
  gToys.splice(idx, 1)
  return _saveToysToFile()
}

function _filter(filterBy) {
  console.log('filterBy:', filterBy)
  const { name } = filterBy
  const regex = new RegExp(name, 'i')
  let filteredToys = gToys.filter((toy) => regex.test(toy.name))

  return filteredToys
}

function save(toy) {
  if (toy._id) {
    const idx = gToys.findIndex((currToy) => currToy._id === toy._id)
    gToys[idx] = toy
  } else {
    toy._id = _makeId()
    gToys.unshift(toy)
  }
  return _saveToysToFile().then(() => toy)
}

function _makeId(length = 5) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}
function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(gToys, null, 2)

    fs.writeFile('data/toy.json', data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}