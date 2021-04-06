const mongoose = require("mongoose");

const postSchema = {
    _ID: mongoose.ObjectId,
    userID: {
        type: mongoose.ObjectId,
        required: true
    },
    title: {type: String, required: true },
    description: {type: String, required: true},
    durationDays: {type: Number, required: true},
    typeOfPost: {type: String, required: true},
    zipcode: {type: String, default: ''},
    price: {type: Number, default: 0},
    pictureKeyArray: [String],
    email: {type: String},
    wechatID: {type: String},
    phoneNum: {type: String},
    createdTimestamp: {type: Date, required: true},
    modifiedTimestamp: {type: Date, required: true}
}

const Post = mongoose.model("Post", postSchema);
module.exports = Post;