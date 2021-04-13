//requirements
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
var cookieParser = require('cookie-parser')
const path = require('path');
require('dotenv').config()

const PORT = process.env.PORT || 5000

//set up app
var corsOptions = {
	origin: 'http://localhost:3000',
	credentials : true
}
  
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

//require routes
app.use("/api", require("./routes/user_route"))
app.use("/api", require("./routes/token_routes"))
app.use("/api", require("./routes/aws_s3_routes"))
app.use("/api", require("./routes/post_route"))

if(process.env.NODE_ENV === 'production') {
	mongoose.connect(process.env.MONGODB_KEY_PROD, {
		useNewUrlParser:true,
		useUnifiedTopology:true,
		useCreateIndex:true,
		useFindAndModify:false
	});
	app.use(express.static('client/build'))
	app.use((req, res, next) => {
		if (req.url.startsWith('/api')) {
			return next();
		}
		return res.sendFile(path.resolve('client/build/index.html'));
	});
}
else{
	mongoose.connect(process.env.MONGODB_KEY_DEV, {
		useNewUrlParser:true,
		useUnifiedTopology:true,
		useCreateIndex:true,
		useFindAndModify:false
	});
}

app.listen(PORT, function() {
    console.log("express server works. Port: ", PORT);
})

app.post('',)