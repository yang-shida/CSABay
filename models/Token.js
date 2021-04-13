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
           createdAt: {
                type: Date, 
                required: true, 
                default: Date.now, 
                expires: 900 //fifteen minues
            }
       }
   ],
}

const Token = mongoose.model("token", tokenSchema);
module.exports = Token;
