const mongoose = require("mongoose");

const tokenSchema = {
    email: {
        type: String, 
        required:true,
        unique:true 
    },
    verificationCodes: [
        {
            code: {type: String},
            createdTimestamp: {type: Date, required: true}
        }
   ],
}

const Token = mongoose.model("token", tokenSchema);
module.exports = Token;
