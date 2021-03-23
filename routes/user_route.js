const express = require("express");
const router = express.Router();
const User = require("../models/user");

//frontend baybay
router.route("/SignupForm").post((req, res)=> {
    //don't think this is right
    const username = req.body.username;
    const pw = req.body.password;

    const u = new User({
        username, 
        pw
    })
    u.save();
})


module.exports = router;