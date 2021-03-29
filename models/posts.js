const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    posterID: { type: String, required: true },
    profilePic: { type: String, required: true},
    image: [{ type: String }],
    location: { type: String, required: true },
    description: { body: String }, ///
    date: { type: String, required: true },
    condition: { type: String }, //condition refers to new, used, etc
    visible: { type: Boolean, required: true },
});

module.exports = mongoose.model('Post', postSchema);