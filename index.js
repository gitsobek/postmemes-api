const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const bodyParser = require('body-parser')
const keys = require('./config/keys')

require('./models/User')
require('./models/Post')
require('./services/passport')

mongoose.Promise = global.Promise
mongoose.connect(keys.mongoURI, { useNewUrlParser: true })

const app = express()

app.use(bodyParser.json())
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}))
app.use(passport.initialize())
app.use(passport.session())

require('./routes/auth')(app)
require('./routes/posts')(app)

app.get('/', (req, res) => {
    res.send({message: "Hello, postmemes API user!"});
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Listening on port', PORT)
})
