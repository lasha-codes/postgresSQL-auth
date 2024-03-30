const express = require('express')
const app = express()
const { pool } = require('./dbConfig.js')
const bcrypt = require('bcryptjs')
const session = require('express-session')

require('dotenv').config()

const PORT = process.env.PORT || 4000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })
)

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
    return console.log('password must be at least 6 characters long')
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

      if (results.rows.length > 0) {
        errors.push({ message: 'Email already registered' })
        return console.log('User with this email already exists')
      }
      pool.query(
        `INSERT INTO users (name, email, password) values ($1, $2, $3) returning id, password`,
        [name, email, hashedPassword],
        (err, results) => {
          if (err) throw err
          console.log(results.rows)
          res.redirect('/users/login')
        }
      )
    }
  )
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
