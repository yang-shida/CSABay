const mongoose = require("mongoose");

const postSchema = {
    _ID: mongoose.ObjectId,
    userID: {
        type: String, //tostring of userid -- idk how to fix this
        unique: true
    },
    pictures: [String],
    cardPictureIndex: {type: Number},
    title: {type: String},
    price: {type: Number},
    profilePicture: {type: String},
    zipcode: {type: Number},
    description: {type: String}
}

const Post = mongoose.model("Post", postSchema);
module.exports = Post;