const mongoose = require("mongoose");

const tokenSchema = {
    firstName: { type:String, required: true },
    lastName: { type:String, required: true },
    _ID: { type: mongoose.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
}

const Token = mongoose.model("token", tokenSchema);
module.exports = Token;