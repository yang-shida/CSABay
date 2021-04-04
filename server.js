//requirements
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
var cookieParser = require('cookie-parser')

//set up app
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//connect to mongoose
//FIX THIS -- VERY INSECURE
mongoose.connect("mongodb+srv://admin:gogators@csacluster.fqmy1.mongodb.net/CSABay_?retryWrites=true&w=majority", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
});

//require routes
app.use("/", require("./routes/user_route"))
app.use("/", require("./routes/aws_s3_routes"))

app.listen(3001, function() {
    console.log("express server works");
})