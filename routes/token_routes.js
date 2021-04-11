const express = require("express");
const router = express.Router();
const Token = require("../models/Token");
const User = require("../models/User");
const randomString = require("randomstring");

router.route("/confirmation").put( 
    (request, response)=> {
        const email = request.body.email;
        const cod = request.body.emailVerification;

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
                    if(Token.findOne({verificationCodes: [{code:cod}]})) {
                        Token.findOneAndUpdate({email:email}, {hasBeenVerified:true}, {returnOriginal:false} )
                        return response.json({code: 0, message: "Verification Successful!"});

                    }
                    //code is not there
                    else {
                        return response.json({code: 1, message: "Invalid Verification Code."});
                    }
                }
            }
        )
});

router.route("/resend").post(
    (req, res)=> {
        const email = request.body.email;
        const newCode = randomString.generate(5);
        console.log("made it to req");
        
        //if the email isn't there, create a new obj.
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
                    //make a new token
                    const toke = new Token ({
                        email:email, 
                        verificationCodes: [
                            {
                                code: newCode
                            }
                        ]
                    })
                    toke.save()
                    .then(
                        (data) => {
                            //send through mailer
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
                                    message: err 
                                })
                            }

                        }
                    )
                }
                else{ 
                    //find the token and add a new code
                    Token.findOneAndUpdate({email:email}, {$push: {verificationCodes: [{code: randomString.generate(5)}]}}, {returnOriginal:false});
                    return response.json(
                        {
                            code: 0,
                            message: "An email has been sent to your account."
                        }
                    )
                    .then(
                        (data) => {
                            //send through mailer
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
                                    message: err 
                                })
                            }

                        }
                    )
                }
            }
        )
});