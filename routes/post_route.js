const { response, Router, request } = require("express");
const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.route("/add-post").post(
    (request, response)=> {
        console.log(request.body.newPost)
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

module.exports = router;