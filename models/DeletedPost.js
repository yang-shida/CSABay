const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const deletedPostSchema = {
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
    modifiedTimestamp: {type: Date, required: true},
    deleteTimestamp: {type: Date, required: true}
}

const DeletedPost = mongoose.model("DeletedPost", deletedPostSchema);
module.exports = DeletedPost;
