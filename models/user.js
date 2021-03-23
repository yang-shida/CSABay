const mongoose = require("mongoose");

const userSchema = {
    username: String, 
    pw: String
}

const User = mongoose.model("User", userSchema);
module.exports = User;