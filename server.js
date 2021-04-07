//requirements
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
var cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 3001

//set up app
var corsOptions = {
	origin: 'http://localhost:3000',
	credentials : true
}
  
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000 ');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

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
app.use("/", require("./routes/post_route"))

if(process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'))
}

app.listen(PORT, function() {
    console.log("express server works. Port: ", PORT);
})