const express = require('express')
const router = express.Router()
const User = require('../models/user')

//access all users route
router.get('/', (req, res) => {
    res.render('./users/index')
})

// create a new user route -- this will link to the signup page once this works, this just displays the form
router.get('/new', (req, res) => {
    res.render('./users/new', { user: new User() })
})

//this will actually create the author -- this is a post, this is again part of the signup page - no rendering
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name, 
        pw: req.body.pw
    })

    try {
        const newUser = await user.save()
        res.redirect(`users`)
    } catch {
        locals = { errorMessage: `Error Creating User`}
        res.render('./users/new', {
            user: user, 
            locals
        })
    }
    //user.save((err, newUser) => {
    //    if (err) {
    //        locals = { errorMessage: `Error Creating User`}
    //        res.render('./users/new', {
    //            user: user, 
    //            locals
    //        })
    //    } else {
    //        //res.redirect(`users/${newUser.id}`)
    //        res.redirect(`users`)
    //    }
    //})
})
module.exports = router