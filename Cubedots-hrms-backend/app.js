const express = require('express')
const bodyParser = require('body-parser')
// const routes = require('./src/routes')
const { SERVER_PORT, NODE_ENV, FE_URL } = require('./config/config')

// Connect to mongodb
require('./db')

const app = express()
const User = require('./db/models/users')
const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept')
    if (req.method === 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
}

app.use(allowCrossDomain)
app.use(bodyParser.json())
app.use('/ping',(req,res)=>{
    res.json({
        msg:'success'
    })
})

app.get('/', async (req, res) => {
    const users = await User.find().select("email firstName lastName _id employeeId phone");
    // res.status(200).json({
    //   users: users
    // })
    res.send(users);
    
})
// app.use('/api', routes)

app.listen(SERVER_PORT, (err) => {
    if (err) {
        console.error(err) // eslint-disable-line no-console
        return
    }
    console.log(`App is running on port ${SERVER_PORT}`) // eslint-disable-line no-console
})

module.exports = app
