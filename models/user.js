const mongoose = require("mongoose");

const userSchema = {
    firstname: { type:String },
    lastname: { type:String },
    _ID: mongoose.ObjectId,
    username: { 
        type:String
    }, 
    email: { 
        type:String,
        unique: true
    }, 
    wechatID: { type:String },
    pw: { type:String },
    phoneNum: { type:Number }, // or { type:String }?
    favorites: [mongoose.ObjectId]
}

const User = mongoose.model("User", userSchema);
module.exports = User;