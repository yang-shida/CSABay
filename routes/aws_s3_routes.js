// S3 Authentication info, need to put in .env file in the future
const config = {
    bucketName: 'csabayphotos',
    region: 'us-east-2',
    accessKeyId: 'AKIA2SGQI5JKBX7R45YB',
    secretAccessKey: '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',
}

var AWS = require('aws-sdk');
const { response, request } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
var S3 = new AWS.S3({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
})

const MAX_CONTENT_LEN = 10485760

router.route("/s3-get-url").post(
    (request, response) => {
        const key = request.body.key 
        var params = {Bucket: config.bucketName, Key: key, Expires: 60}
        S3.getSignedUrl('getObject', params,
            (err, url) => {
                if(err){
                    console.log(err)
                    return response.json(
                        {
                            code: 1,
                            message: err.message
                        }
                    )
                }
                else{
                    return response.json(
                        {
                            code: 0,
                            url: url
                        }
                    )
                }
            }
        )
    }
)

router.route("/s3-get-signed-post").post(
    (request, response) => {
        const {file, dir} = request.body 
        S3.createPresignedPost({
            Fields: {
                key: `${dir}/${file.uid}`,
            },
            Expires: 30,
            Bucket: config.bucketName,
            Conditions: [
                ["starts-with", "$Content-Type", "image/"],
                ["content-length-range", 0, MAX_CONTENT_LEN+1000000]
            ]
        }, (err, signed) => {
            if(err){
                console.log("Fail to create pre-signed post")
                console.log(err)
                return response.json(
                    {
                        code: 1,
                        message: "Fail to create pre-signed post"
                    }
                )
            }
            else if(signed){
                console.log("Created pre-signed post")
                console.log(signed)
                return response.json(
                    {
                        code: 0,
                        signed: signed
                    }
                )
            }
        })
    }
)

module.exports = router;