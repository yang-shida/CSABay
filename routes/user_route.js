const express = require("express");
const router = express.Router();
const User = require("../models/User");

//post new user
router.route("/add-user").post((req, res)=> {
    const pwd = req.body.pwd;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const emailVerification = req.body.emailVerification;
    const wechatID = req.body.wechatID;
    const phoneNum = req.body.phoneNum;
    const profilePictureKey = req.body.profilePictureKey;

    // TODO: check if email verification code match, delete after verifying

    const u = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        wechatID: wechatID,
        pwd: pwd,
        phoneNum: phoneNum,
        profilePictureKey: profilePictureKey,
        savedPosts: []
    })

    u.save()
        .then(
            (data) => {
                console.log(data)
                res.send({
                    code: 0
                })
            }
        )
        .catch(
            (err) => {
                console.log(err)
                if(err.code === 11000){
                    res.send({
                        code: 1,
                        message: "Email already exists!"
                    })
                }
                else{
                    res.send({
                        code: 1,
                        message: err // TODO: research for different error types and replace message with meaningful string that describes the error
                    })
                }
                
            }
        )

    
})

//edit user -- get and post

//get user information

//get favorites information

//get posts information?


module.exports = router;