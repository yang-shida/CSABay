const mongoose = require("mongoose");

const userSchema = {
    firstName: { type:String },
    lastName: { type:String },
    _ID: mongoose.ObjectId,
    email: { 
        type:String,
        unique: true
    }, 
    wechatID: { type:String },
    pwd: { type:String },
    phoneNum: { type:Number }, // or { type:String }?
    savedPosts: [mongoose.ObjectId],
    profilePictureKey: { type:String }
}

const User = mongoose.model("User", userSchema);
module.exports = User;