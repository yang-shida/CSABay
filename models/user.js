const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    pw: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    weChat: { type: String },
    phone: { type: String },
    clubStatus: { type: String},
    pastPW: [{ type: String, num: Number}],
    posts: [{ type: String }]
});

module.exports = mongoose.model('User', userSchema);