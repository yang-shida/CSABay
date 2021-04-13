const { resolve, reject } = require("bluebird");
const { response, Router, request } = require("express");
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const DeletedPost = require("../models/DeletedPost");
const User = require("../models/User");
const schedule = require('node-schedule');
var AWS = require('aws-sdk');
const mailer = require("../misc/mailer")

const config = {
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    region: process.env.AWS_S3_REGION,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
}
var S3 = new AWS.S3({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
})

const durationDaysChecker = schedule.scheduleJob('0 0 0 * * *', function(){
    
    const threeDaysInMSeconds = 3 * 24 * 3600 * 1000;
    const timeNow = Date.now()
    console.log("Running post cleanup: ", new Date(timeNow).toLocaleDateString("en-US"))
    Post.find({}).exec(
        (err, allPosts) => {
            if(err){
                console.log(err)
            }
            if(!allPosts){
                console.log("DurationDays Checker: No post")
            }
            else{
                for(const post of allPosts){
                    const endTime = post.durationDays * 24 * 3600 * 1000 + Date.parse(post.modifiedTimestamp)
                    const timeDiff = endTime - timeNow
                    if(timeDiff > threeDaysInMSeconds){
                        // more than 3 days, do nothing
                    }
                    else if(timeDiff > 0){
                        // within 3 days, send email
                        console.log(" - Send reminder post: ", post.title)
                        User.findById(post.userID).exec(
                            (err, user) => {
                                if(err){
                                    console.log(err)
                                }
                                else{
                                    mailer.sendExpireReminderEmail(post, user.email, false)
                                }
                            }
                        )
                        
                    }
                    else{
                        // expired, delete post
                        console.log(" - Delete post: ", post.title)
                        const pictureKeyArray = post.pictureKeyArray
                        const newDeletedPost = new DeletedPost({
                            _id: post._id,
                            userID: post.userID,
                            title: post.title,
                            description: post.description,
                            durationDays: post.durationDays,
                            typeOfPost: post.typeOfPost,
                            zipcode: post.zipcode,
                            price: post.price,
                            pictureKeyArray: post.pictureKeyArray,
                            email: post.email,
                            wechatID: post.wechatID,
                            phoneNum: post.phoneNum,
                            createdTimestamp: post.createdTimestamp,
                            modifiedTimestamp: post.modifiedTimestamp,
                            deleteTimestamp: Date.now()
                        })
                        newDeletedPost.save()
                            .then(
                                () => {
                                    Post.deleteOne({_id: post._id}).exec(
                                        (err, doc) => {
                                            if(err){
                                                console.log(err)
                                            }
                                            else{
                                                User.findById(post.userID).exec(
                                                    (err, user) => {
                                                        if(err){
                                                            console.log(err)
                                                        }
                                                        else{
                                                            mailer.sendExpireReminderEmail(post, user.email, true)
                                                        }
                                                    }
                                                )
                                                // Do this only if you really want to permanately delete the post since it removes all pictures associated with this post in AWS S3
                                                // for(const pictureKey of pictureKeyArray){
                                                //     var params = {
                                                //         Bucket: config.bucketName, 
                                                //         Key: pictureKey
                                                //     };
                                                //     S3.deleteObject(params, function(err, data) {
                                                //         if (err) {
                                                //             console.log(err)
                                                //         }
                                                //     });
                                                // }
                                            }
                                        }
                                    )
                                }
                            )
                            .catch(
                                (err) => {
                                    console.log(err)
                                }
                            )
                        
                    }
                }
            }
        }
    )
  });

router.route("/add-post").post(
    (request, response)=> {
        const userID = request.cookies.userid
        if(!userID){
            return response.json(
                {
                    code: 1,
                    message: "User not authenticated!"
                }
            )
        }
        const timeNow = Date.now()
        const newPost = new Post({...request.body.newPost, userID: userID, createdTimestamp: timeNow, modifiedTimestamp: timeNow})    
        
        newPost.save()
            .then(
                (data) => {
                    User.findById(userID).exec(
                        (err, user) => {
                            if(err){
                                console.log(err)
                            }
                            else{
                                mailer.sendCreatePostEmail(data, user.email)
                            }
                        }
                    )
                    return response.json({
                        code: 0
                    })
                }
            )
            .catch(
                (err) => {
                    console.log(err)
                    return response.json({
                        code: 1,
                        message: "Something went wrong!"
                    })
                    
                }
            )
    
        
    }
)

router.route('/update-post').put(
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

        const updatedPost = request.body.updatedPost
        Post.findOne({_id: updatedPost._id}).exec(
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
                            message: "Post not found!"
                        }
                    )
                }
                else if(doc.userID != userID){
                    return response.json(
                        {
                            code: 1,
                            message: "You can only edit your own post!"
                        }
                    )
                }
                else{
                    Post.findOneAndUpdate({_id: updatedPost._id}, {...updatedPost, modifiedTimestamp: Date.now()}, {returnOriginal: false}).exec(
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
                                        message: "Post not found!"
                                    }
                                )
                            }
                            else{
                                User.findById(userID).exec(
                                    (err, user) => {
                                        if(err){
                                            console.log(err)
                                        }
                                        else{
                                            mailer.sendUpdatePostEmail(doc, user.email)
                                        }
                                    }
                                )
                                return response.json(
                                    {
                                        code: 0,
                                        message: "Post updated!",
                                        data: doc
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

router.route('/get-post-by-user').get(
    (request, response) => {
        userID = request.cookies.userid
        if(!userID){
            return response.json(
                {
                    code: 1,
                    message: "User not authenticated!"
                }
            )
        }

        Post.find({userID: userID}, null, {sort:{modifiedTimestamp: 'desc'}}).exec(
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
                            code: 0,
                            data: []
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

router.route('/get-post-by-time').get(
    async (request, response) => {
        const paramsStr = request.url.substring(request.url.indexOf('?'))
        let params = new URLSearchParams(paramsStr)
        const startIndex = params.get('startIndex')
        const numberOfPosts = params.get('numberOfPosts')
        const order = params.get('order')
        const typeOfPost = params.get('typeOfPost')
        
        Post.find(typeOfPost?{typeOfPost: typeOfPost}:{}, null, {sort:{modifiedTimestamp: order=='new'?'desc':'asc'}, skip: Number(startIndex), limit: Number(numberOfPosts)}).exec(
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
                            code: 0,
                            data: []
                        }
                    )
                }
                else{
                    const addUserInfo = () => {
                        return new Promise(
                            async (resolve, reject) => {
                                var count = doc.length
                                var postsWithUserInfo = []
                                for (const post in doc) {
                                    const currentPost = doc[post]._doc
                                    if(request.cookies.userid){
                                        await User.findOne({_id: currentPost.userID}, {_id: 0, firstName: 1, lastName: 1, profilePictureKey: 1}, null,
                                            (err, doc) => {
                                                if(err){
                                                    console.log(err)
                                                    reject(
                                                        {
                                                            code: 1,
                                                            message: "Something went wrong on our end."
                                                        }
                                                    )
                                                }
                                                if(!doc){
                                                    reject(
                                                        {
                                                            code: 1,
                                                            message: "Poster does not exist!"
                                                        }
                                                    )
                                                }
                                                else{
                                                    postsWithUserInfo = [...postsWithUserInfo, {...currentPost, simplifiedUserInfo: doc}]
                                                    count--
                                                    if(count==0){ 
                                                        resolve(postsWithUserInfo)
                                                    }
                                                }
                                            }
                                        )
                                    }
                                    else{
                                        currentPost.email = 'Hidden'
                                        currentPost.phoneNum = 'Hidden'
                                        currentPost.wechatID = 'Hidden'
                                        postsWithUserInfo = [...postsWithUserInfo, {...currentPost, simplifiedUserInfo: {firstName: 'Hidden', lastName: 'Hidden', profilePictureKey: ''}}]
                                        count--
                                        if(count==0){ 
                                            resolve(postsWithUserInfo)
                                        }
                                    }
                                    
                                }
                                if(count==0){
                                    resolve(postsWithUserInfo)
                                }
                                
                            }
                        )
                        
                    }

                    addUserInfo()
                        .then(
                            (postsWithUserInfo) => {
                                return response.json(
                                    {
                                        code: 0,
                                        data: postsWithUserInfo
                                    }
                                )
                            }
                        )
                        .catch(
                            (err) => {
                                return response.json(err)
                            }
                        )
                }
            }
        )

        

        

    }
)

router.route('/get-post-by-price').get(
    (request, response) => {
        const paramsStr = request.url.substring(request.url.indexOf('?'))
        let params = new URLSearchParams(paramsStr)
        const startIndex = params.get('startIndex')
        const numberOfPosts = params.get('numberOfPosts')
        const order = params.get('order')
        const typeOfPost = params.get('typeOfPost')
        
        Post.find(typeOfPost?{typeOfPost: typeOfPost}:{}, null, {sort:{price: order=='high'?'desc':'asc', modifiedTimestamp: 'desc'}, skip: Number(startIndex), limit: Number(numberOfPosts)}).exec(
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
                            code: 0,
                            data: []
                        }
                    )
                }
                else{
                    const addUserInfo = () => {
                        return new Promise(
                            async (resolve, reject) => {
                                var count = doc.length
                                var postsWithUserInfo = []
                                for (const post in doc) {
                                    const currentPost = doc[post]._doc
                                    if(request.cookies.userid){
                                        await User.findOne({_id: currentPost.userID}, {_id: 0, firstName: 1, lastName: 1, profilePictureKey: 1}, null,
                                            (err, doc) => {
                                                if(err){
                                                    console.log(err)
                                                    reject(
                                                        {
                                                            code: 1,
                                                            message: "Something went wrong on our end."
                                                        }
                                                    )
                                                }
                                                if(!doc){
                                                    reject(
                                                        {
                                                            code: 1,
                                                            message: "Poster does not exist!"
                                                        }
                                                    )
                                                }
                                                else{
                                                    postsWithUserInfo = [...postsWithUserInfo, {...currentPost, simplifiedUserInfo: doc}]
                                                    count--
                                                    if(count==0){ 
                                                        resolve(postsWithUserInfo)
                                                    }
                                                }
                                            }
                                        )
                                    }
                                    else{
                                        currentPost.email = 'Hidden'
                                        currentPost.phoneNum = 'Hidden'
                                        currentPost.wechatID = 'Hidden'
                                        postsWithUserInfo = [...postsWithUserInfo, {...currentPost, simplifiedUserInfo: {firstName: 'Hidden', lastName: 'Hidden', profilePictureKey: ''}}]
                                        count--
                                        if(count==0){ 
                                            resolve(postsWithUserInfo)
                                        }
                                    }
                                    
                                }
                                if(count==0){
                                    resolve(postsWithUserInfo)
                                }
                                
                            }
                        )
                        
                    }

                    addUserInfo()
                        .then(
                            (postsWithUserInfo) => {
                                return response.json(
                                    {
                                        code: 0,
                                        data: postsWithUserInfo
                                    }
                                )
                            }
                        )
                        .catch(
                            (err) => {
                                return response.json(err)
                            }
                        )
                }
            }
        )
    }
)

router.route('/get-post-by-id').get(
    async (request, response) => {
        const paramsStr = request.url.substring(request.url.indexOf('?'))
        let params = new URLSearchParams(paramsStr)
        const postID = params.get('postID')
        
        Post.findOne({_id: postID}, null, {sort:{modifiedTimestamp:'desc'}}).exec(
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
                            message: "Post not found"
                        }
                    )
                }
                else{
                    const addUserInfo = () => {
                        return new Promise(
                            async (resolve, reject) => {
                                var postsWithUserInfo = {}
                                const currentPost = doc._doc
                                await User.findOne({_id: currentPost.userID}, {_id: 0, firstName: 1, lastName: 1, profilePictureKey: 1}, null,
                                    (err, doc) => {
                                        if(err){
                                            console.log(err)
                                            reject(
                                                {
                                                    code: 1,
                                                    message: "Something went wrong on our end."
                                                }
                                            )
                                        }
                                        if(!doc){
                                            reject(
                                                {
                                                    code: 1,
                                                    message: "Poster does not exist!"
                                                }
                                            )
                                        }
                                        else{
                                            postsWithUserInfo = {...currentPost, simplifiedUserInfo: doc}
                                            resolve(postsWithUserInfo)
                                        }
                                    }
                                )
                            }
                        )
                        
                    }

                    addUserInfo()
                        .then(
                            (postsWithUserInfo) => {
                                return response.json(
                                    {
                                        code: 0,
                                        data: postsWithUserInfo
                                    }
                                )
                            }
                        )
                }
            }
        )
    }
)

router.route('/delete-single-post').delete(
    (request, response) => {
        const paramsStr = request.url.substring(request.url.indexOf('?'))
        let params = new URLSearchParams(paramsStr)
        const postID = params.get('postID')
        const userID = request.cookies.userid 

        Post.findById(postID).exec(
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
                            message: "Post does not exist!"
                        }
                    )
                }
                else{
                    if(doc.userID != userID){
                        return response.json(
                            {
                                code: 1,
                                message: "You can only delete your own post!"
                            }
                        )
                    }
                    else{
                        const pictureKeyArray = doc.pictureKeyArray
                        const newDeletedPost = new DeletedPost({
                            _id: doc._id,
                            userID: doc.userID,
                            title: doc.title,
                            description: doc.description,
                            durationDays: doc.durationDays,
                            typeOfPost: doc.typeOfPost,
                            zipcode: doc.zipcode,
                            price: doc.price,
                            pictureKeyArray: doc.pictureKeyArray,
                            email: doc.email,
                            wechatID: doc.wechatID,
                            phoneNum: doc.phoneNum,
                            createdTimestamp: doc.createdTimestamp,
                            modifiedTimestamp: doc.modifiedTimestamp,
                            deleteTimestamp: Date.now()
                        })
                        newDeletedPost.save()
                            .then(
                                () => {
                                    Post.deleteOne({_id: postID}).exec(
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
                                            else{
                                                // Do this only if you really want to permanately delete the post since it removes all pictures associated with this post in AWS S3
                                                // for(const pictureKey of pictureKeyArray){
                                                //     var params = {
                                                //         Bucket: config.bucketName, 
                                                //         Key: pictureKey
                                                //     };
                                                //     S3.deleteObject(params, function(err, data) {
                                                //         if (err) {
                                                //             console.log(err)
                                                //         }
                                                //     });
                                                // }
                                                return response.json(
                                                    {
                                                        code: 0,
                                                        message: "Post deleted"
                                                    }
                                                )
                                            }
                                        }
                                    )
                                }
                            )
                            .catch(
                                (err) => {
                                    console.log(err)
                                    return response.json(
                                        {
                                            code: 1,
                                            message: "Fail to delete post"
                                        }
                                    )
                                }
                            )
                    }
                }
            }
        )


    }
    
)


module.exports = router;