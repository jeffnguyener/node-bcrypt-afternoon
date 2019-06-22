require('dotenv').config()
const express = require('express')
const { SERVER_PORT, SESSION_SECRET, CONNECTION_STRING } = process.env
const session = require('express-session')
const massive = require('massive')
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware');


const app = express()

app.use(express.json())
app.use(
    session({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60
        }
    }
))

//GET ENDPOINTS
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)


//POST ENDPOINTS
app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)

app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)

massive(CONNECTION_STRING).then(database =>{
    app.set('db', database)
    console.log('Database moving along')
})

app.listen(SERVER_PORT, () => { console.log(`Cruising on port ${SERVER_PORT}`)
})