require('dotenv').config()
const express = require('express')
const { SERVER_PORT, SESSION_SECRET, CONNECTION_STRING } = process.env
const session = require('express-session')
const massive = require('massive')
const authCtrl = require('./controllers/authController')
const app = express()

app.use(express.json())
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 600
        }
    }
))

app.post('/auth/register', authCtrl.register);

massive(CONNECTION_STRING).then(database =>{
    app.set('db', database)
    console.log('Database moving along')
})

app.listen(SERVER_PORT, () => { console.log(`Cruising on port ${SERVER_PORT}`)
})