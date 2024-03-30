const express = require('express')
const app = express()
const { pool } = require('./dbConfig.js')
const bcrypt = require('bcryptjs')

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

app.post('/users/register', async (req, res) => {
  let { name, email, password, password2 } = req.body

  console.log({ name, email, password, password2 })

  let errors = []

  if (!name || !email || !password || !password2) {
    errors.push({ message: 'Please enter all fields' })
    return console.log('All of the fields are required')
  }

  if (password.length < 6) {
    errors.push({ message: 'Password should be at least 6 characters' })
    return window.alert('password must be at least 6 characters long')
  }

  if (password !== password2) {
    errors.push({ message: 'Passwords do not match' })
    return console.log('both passwords must match each other')
  }

  let hashedPassword = await bcrypt.hash(password, 10)
  console.log(hashedPassword)

  pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email],
    (err, results) => {
      if (err) throw err
      console.log(results.rows)
    }
  )
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
