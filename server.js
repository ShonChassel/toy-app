const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const toyService = require('./services/toy.service')

const app = express()

const port = process.env.PORT || 3030;

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

const corsOptions = {
  origin: [
    'http://127.0.0.1:8080',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
  ],
  credentials: true,
}
app.use(cors(corsOptions))

// Express Routing:

//?--------LIST
app.get('/api/toys', (req, res) => {
  console.log('hey')
  console.log('req.query')

  var { name, minPrice, maxPrice, label, sort, inStock } = req.query

  const filterBy = {
    name: name || '',
    minPrice: minPrice || '',
    maxPrice: maxPrice || '',
    label: label || 'All',
    sort: sort || 'name',
    inStock: JSON.parse(inStock),
  }
  toyService.query(filterBy).then((toys) => {
    res.send(toys)
  })
})

//?--------- READ
app.get('/api/toys/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService.getById(toyId).then((toy) => {
    res.send(toy)
  })
})

//?------ADD
app.post('/api/toys', (req, res) => {
  const { name, price, } = req.body
  const toy = {
    name,
    price,
    inStock: true,
    createdAt: Date.now(),
    labels:["Doll","Battery Powered","Baby"]
  }
  toyService.save(toy).then((savedToy) => {
    res.send(savedToy)
  })
})
//?------UPDATE
app.put('/api/toys/:toyId', (req, res) => {
  const { name, price, _id, inStock, createdAt, labels, reviews } = req.body

  const toy = {
    _id,
    name,
    price,
    inStock,
    createdAt,
    labels,
    reviews,
  }
  toyService.save(toy).then((savedToy) => {
    res.send(savedToy)
  })
})

//?------- DELETE
app.delete('/api/toys/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService.remove(toyId).then(() => {
    res.send('Removed!')
  })
})

// LOGIN
app.post('/login', (req, res) => {
  console.log('req.body:', req.body)
  res.cookie('user', req.body)
  res.send('logging  in')
})
app.post('/logout', (req, res) => {
  res.clearCookie('loggedInUser')
  res.clearCookie('user')
  res.send('logging  uot')
})

// app.listen(3030, () =>
//   console.log(`Server listening on port http://127.0.0.1:3030/`)
// )

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
});

