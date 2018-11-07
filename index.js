const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport');
const bodyParser = require('body-parser')

require('./models/User')
require('./models/Post')
require('./services/passport')

const app = express()

app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())

require('./routes/auth')(app)
require('./routes/posts')(app)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log('Listening on port', PORT)
})
