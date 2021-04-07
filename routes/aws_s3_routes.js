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
        const {fileUid, dir} = request.body 
        S3.createPresignedPost({
            Fields: {
                key: `${dir}/${fileUid}`,
            },
            Expires: 30,
            Bucket: config.bucketName,
            Conditions: [
                ["starts-with", "$Content-Type", "image/"],
                ["content-length-range", 0, MAX_CONTENT_LEN+1000000]
            ]
        }, (err, signed) => {
            if(err){
                console.log(err)
                return response.json(
                    {
                        code: 1,
                        message: "Fail to create pre-signed post"
                    }
                )
            }
            else if(signed){
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

router.route("/s3-get-object-type").post(
    (request, response) => {
        const key = request.body.key 
        var params = {
            Bucket: config.bucketName, 
            Key: key
        };
        S3.headObject(params, function(err, data) {
            if (err) {
                console.log(err)
                return response.json(
                    {
                        code: 1,
                        message: "Fail to get object type"
                    }
                )
            }
            else {
                return response.json(
                    {
                        code: 0,
                        type: data.ContentType
                    }
                )
            }    
            /*
            data = {
            AcceptRanges: "bytes", 
            ContentLength: 3191, 
            ContentType: "image/jpeg", 
            ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
            LastModified: <Date Representation>, 
            Metadata: {
            }, 
            VersionId: "null"
            }
            */
        });
    }
)

router.route("/s3-delete-by-key").post(
    (request, response) => {
        const key = request.body.key 
        var params = {
            Bucket: config.bucketName, 
            Key: key
        };
        S3.deleteObject(params, function(err, data) {
            if (err) {
                return response.json(
                    {
                        code: 1,
                        message: "Fail to delete object"
                    }
                )
            }
            else{
                return response.json(
                    {
                        code: 0
                    }
                )
            }
        });
    }
)

// router.route("/s3-").post(
//     (request, response) => {
        
//     }
// )

module.exports = router;