const express = require('express')
const app = express()
const { pool } = require('./dbConfig.js')

require('dotenv').config()

const PORT = process.env.PORT || 4000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.get('/users/dashboard', (req, res) => {
  res.render('dashboard', { user: 'Lasha' })
})

app.post('/users/register', (req, res) => {
  let { name, email, password, password2 } = req.body

  console.log({ name, email, password, password2 })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
