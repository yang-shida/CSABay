//load database & check for dev environment
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

//server requirements
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

//include routes
const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')

//set server requirements
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

//importing the database
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.error('Connected to mongoose'))


//use index route
app.use('/', indexRouter)
app.use('/users', userRouter)

//localhost
app.listen(process.env.PORT || 3000)