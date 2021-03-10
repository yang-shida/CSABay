const mongoose = require('mongoose')

//make the user schemas
const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    }
    ,
    pw: {
        type: String,
        require: true
    }
})
module.exports = mongoose.model('User', userSchema)