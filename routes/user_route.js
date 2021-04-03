const express = require("express");
const router = express.Router();
const User = require("../models/User");

//post new user
router.route("/SignupForm").post((req, res)=> {
    const username = req.body.username;
    const pw = req.body.pw;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const wechatID = req.body.wechatID;
    const phoneNum = req.body.phoneNum;

    const u = new User({
        username, 
        pw,
        firstname,
        lastname,
        email,
        wechatID,
        phoneNum
    })
    u.save();
})

//edit user -- get and post

//get user information

//get favorites information

//get posts information?


module.exports = router;