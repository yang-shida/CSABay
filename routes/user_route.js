const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/Token");
const hidePwdAndID = {pwd: 0, _id: 0}
const bodyParser = require("body-parser");
// const exphbs = require("express-handlebars");

//post new user
router.route("/add-user").post((request, response)=> {
    //Generate Verification Code
    const pwd = request.body.pwd;
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const email = request.body.email;
    const wechatID = request.body.wechatID;
    const phoneNum = request.body.phoneNum;
    const profilePictureKey = request.body.profilePictureKey;
    const emailVerification = request.body.emailVerification;

    let success = false;
    //check the db for a matching token
    Token.findOne({email: email}).exec(
       (err, token) => {
           if(err){
               console.log(err)
               return response.json(
                   {
                       code: 1,
                       message: "Something went wrong on our end."
                   }
               )
           }
           if(!token){
               return response.json(
                   {
                       code: 1,
                       message: "Please request a verification code for this email!"
                   }
               )
           }
           else{
               //code is there
               //error with expiration -- whole token expires
               //error with findOne -- should you cross-find with emmail too? -- go through oject
               if(Token.findOne({
                   verificationCodes: 
                   {
                        code:emailVerification
                   }            
                   })) {
                   Token.findOneAndUpdate({email:email}, {$set:{verificationCodes:[]}}, {returnOriginal:false} )
                    const u = new User({
                         firstName: firstName,
                         lastName: lastName,
                         email: email,
                         wechatID: wechatID,
                         pwd: pwd,
                         phoneNum: phoneNum,
                         profilePictureKey: profilePictureKey,
                         isVerified: true,
                         savedPosts: []
                     })
                     u.save()
                         .then(
                             (data) => {
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
                    }
               //code is not there
               else {
                return response.json(
                    {
                        code: 1,
                        message: "Incorrect email verification code, please try again."
                    }
                )
               }
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
                    response.cookie('userid', doc._id, {sameSite: 'lax'});
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

router.route("/get-user-info-by-id").get(
    (request, response) => {
        const userID = request.body.userID
        if(!userID){
            return response.json(
                {
                    code: 1,
                    message: "Did not receive UserID!"
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
                            data: doc
                        }
                    )
                }
            }
        )
    }
)

router.route("/update-user-info").put(
    (request, response) => {
        const userID = request.cookies.userid
        const newUser = request.body.newUser
        if(!userID){
            return response.json(
                {
                    code: 1,
                    message: "User not authenticated!"
                }
            )
        }

        User.findOneAndUpdate({_id: userID}, newUser, {returnOriginal: false}).exec(
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
                            message: "User updated!",
                            data: doc
                        }
                    )
                }
            }
        )
    }
)

router.route("/change-password").put(
    (request, response) => {
        const userID = request.cookies.userid
        const pwds = request.body
        if(!userID){
            return response.json(
                {
                    code: 1,
                    message: "User not authenticated!"
                }
            )
        }

        User.findOne({_id: userID}).exec(
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
                else if(doc.pwd !== pwds.oldPwd){
                    return response.json(
                        {
                            code: 1,
                            message: "Old password incorrect!"
                        }
                    )
                }
                else{
                    User.findOneAndUpdate({_id: userID}, {pwd: pwds.pwd}, {returnOriginal: false}).exec(
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
                                        message: "Password updated!"
                                    }
                                )
                            }
                        }
                    )
                }
            }
        )

        
    }
)

router.route("/forgot-password").put(
    (request, response) => {
        const {email, emailVerification, pwd} = request.body

        // get email verification code in DB based on email

        // check if match

        // if match
        User.findOneAndUpdate({email: email}, {pwd: pwd}, {returnOriginal: false}).exec(
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
                            message: "Password updated!"
                        }
                    )
                }
            }
        )


    }
)

module.exports = router;