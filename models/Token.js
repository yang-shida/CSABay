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
            createdTimestamp: {type: Date, required: true, default: Date.now()}
        }
   ],
   modifiedTimestamp: {
       type: Date,
       require: true,
       expires: 900
   }
}

const Token = mongoose.model("token", tokenSchema);
module.exports = Token;
