const { resolve, reject } = require("bluebird");
const { response, Router, request } = require("express");
const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/User");

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
                    console.log(data)
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
                    console.log(doc.userID, userID)
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
                                console.log(doc)
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
                                var postsWithUserInfo = []
                                console.log("------------")
                                console.log(doc.length)
                                var count = doc.length;
                                for(const post of doc) {
                                    const currentPost = post._doc
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
                                                if(count == 0){
                                                    resolve(postsWithUserInfo)
                                                }
                                            }
                                        }
                                    )
                                }
                            }
                        )
                        
                    }

                    addUserInfo()
                        .then(
                            (postsWithUserInfo) => {
                                console.log(postsWithUserInfo.length)
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

router.route('/get-post-by-price').get(
    (request, response) => {
        const paramsStr = request.url.substring(request.url.indexOf('?'))
        let params = new URLSearchParams(paramsStr)
        const startIndex = params.get('startIndex')
        const numberOfPosts = params.get('numberOfPosts')
        const order = params.get('order')
        const typeOfPost = params.get('typeOfPost')
        
        Post.find(typeOfPost?{typeOfPost: typeOfPost}:{}, null, {sort:{modifiedTimestamp: order=='high'?'desc':'asc'}, skip: Number(startIndex), limit: Number(numberOfPosts)}).exec(
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
                                var postsWithUserInfo = []
                                for (const post in doc) {
                                    const currentPost = doc[post]._doc
                                    console.log(doc[post]._doc)
                                    // console.log(currentPost)
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
                                            }
                                        }
                                    )
                                }
                                
                                resolve(postsWithUserInfo)
                            }
                        )
                        
                    }

                    addUserInfo()
                        .then(
                            (postsWithUserInfo) => {
                                // console.log("final array: ", postsWithUserInfo)
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
                                console.log(postsWithUserInfo.length)
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
                        Post.remove({_id: postID}).exec(
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
                }
            }
        )


    }
    
)


module.exports = router;