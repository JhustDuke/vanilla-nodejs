const mongoose = require("./connection");
const log = require("../utils/log");
const usersSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			required: [true, "email is required"],
		},
		password: {
			type: String,
			unique: false,
			required: [true, "password is required"],
		},
		confirm_password: {
			type: String,
			unique: false,
			required: [true, "confirm password is required"],
		},
	},
	{ collection: "users" }
);
const UserHandler = mongoose.model("User", usersSchema);

module.exports = UserHandler;
