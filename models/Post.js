const mongoose = require("mongoose");

const postSchema = {
    _ID: mongoose.ObjectId,
    userID: {
        type: mongoose.ObjectId
    },
    title: {type: String},
    description: {type: String},
    durationDays: {type: Number},
    typeOfPost: {type: String},
    zipcode: {type: Number},
    price: {type: Number},
    pictureKeyArray: [{type: String}],
    email: {type: String},
    wechatID: {type: String},
    phoneNum: {type: String},
    createdTimestamp: {type: Date},
    modifiedTimestamp: {type: Date}
}

const Post = mongoose.model("Post", postSchema);
module.exports = Post;