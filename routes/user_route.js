const { response } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const hidePwdAndID = {pwd: 0, _id: 0}

//post new user
router.route("/add-user").post((request, response)=> {
    const pwd = request.body.pwd;
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const email = request.body.email;
    const emailVerification = request.body.emailVerification;
    const wechatID = request.body.wechatID;
    const phoneNum = request.body.phoneNum;
    const profilePictureKey = request.body.profilePictureKey;

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
                return response.json({
                    code: 0
                })
            }
        )
        .catch(
            (err) => {
                console.log(err)
                if(err.code === 11000){
                    return response.json({
                        code: 1,
                        message: "Email already exists!"
                    })
                }
                else{
                    return response.json({
                        code: 1,
                        message: err // TODO: research for different error types and replace message with meaningful string that describes the error
                    })
                }
                
            }
        )

    
})

router.route("/user-login").post(
    (request, response) => {
        const email = request.body.email;
        const pwd = request.body.pwd;

        User.findOne({email: email}).exec(
            (err, doc) => {
                if(err){
                    console.log(err)
                    return response.json(
                        {
                            code: 1,
                            message: "Something went wrong on our end."
                        }
                    )
                }
                if(!doc){
                    return response.json(
                        {
                            code: 1,
                            message: "User not found!"
                        }
                    )
                }
                else if(doc.pwd !== pwd){
                    return response.json(
                        {
                            code: 1,
                            message: "Password incorrect!"
                        }
                    )
                }
                else{
                    response.cookie('userid', doc._id);
                    return response.json(
                        {
                            code: 0,
                            message: "Login success!",
                            data: {
                                firstName: doc.firstName,
                                lastName: doc.lastName,
                                email: doc.email,
                                wechatID: doc.wechatID,
                                phoneNum: doc.phoneNum,
                                profilePictureKey: doc.profilePictureKey,
                                savedPosts: doc.savedPosts
                            }
                        }
                    )
                }
            }
        )
    }
)

router.route("/get-user-info").get(
    (request, response) => {
        const userID = request.cookies.userid
        if(!userID){
            return response.json(
                {
                    code: 1,
                    message: "User not authenticated!"
                }
            )
        }

        User.findOne({_id: userID}, hidePwdAndID).exec(
            (err, doc) => {
                if(err){
                    console.log(err)
                    return response.json(
                        {
                            code: 1,
                            message: "Something went wrong on our end."
                        }
                    )
                }
                if(!doc){
                    return response.json(
                        {
                            code: 1,
                            message: "User not found!"
                        }
                    )
                }
                else{
                    return response.json(
                        {
                            code: 0,
                            message: "User authenticated!",
                            data: doc
                        }
                    )
                }
            }
        )
    }
)

//edit user -- get and post

//get user information

//get favorites information

//get posts information?


module.exports = router;