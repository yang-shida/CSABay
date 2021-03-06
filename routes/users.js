const express = require('express')
const router = express.Router()

//access all users route
router.get('/', (req, res) => {
    res.render('./users/index')
})

// create a new user route -- this will link to the signup page once this works, this just displays the form
router.get('/new', (req, res) => {
    res.render('./users/new')
})

//this will actually create the author -- this is a post, this is again part of the signup page - no rendering
router.post('/', (req, res) => {
    res.send('Create')
})
module.exports = router