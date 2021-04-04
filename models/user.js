const mongoose = require("mongoose");

const userSchema = {
    firstName: { type:String, required: true },
    lastName: { type:String, required: true },
    _ID: mongoose.ObjectId,
    email: { 
        type:String,
        unique: true,
        required: true
    }, 
    wechatID: { type:String },
    pwd: { type:String, required: true },
    phoneNum: { type:Number }, // or { type:String }?
    savedPosts: [mongoose.ObjectId],
    profilePictureKey: { type:String }
}

const User = mongoose.model("User", userSchema);
module.exports = User;