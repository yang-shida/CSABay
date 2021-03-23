//requirements
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

//set up app
app.use(cors());
app.use(express.json());

//connect to mongoose
//FIX THIS -- VERY INSECURE
mongoose.connect("mongodb+srv://admin:password69@csabaycluster.dumzv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

//require route
app.use("/", require("./routes/user_route"))

app.listen(3001, function() {
    console.log("express server works");
})