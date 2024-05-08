const mongoose = require("mongoose");
const dbUrl = "mongodb://127.0.0.1:27017/node101";
const log = require("../utils/log");
mongoose
	.connect(dbUrl, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(function () {
		log("db connected");
	})
	.catch(function () {
		log("db not connected");
	});

module.exports = mongoose;
