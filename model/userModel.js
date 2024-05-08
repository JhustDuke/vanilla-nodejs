const mongoose = require("./connection");
const log = require("../utils/log");
const usersSchema = new mongoose.Schema(
	{
		FirstName: {
			type: String,
			unique: false,
			required: [true, "firstname is required"],
		},
		LastName: {
			type: String,
			unique: false,
			required: [true, "LastName is required"],
		},
		PhoneNumber: {
			type: Number,
			unique: true,
			required: [true, "phone number is required"],
		},
	},
	{ collection: "users" }
);
const UserHandler = mongoose.model("User", usersSchema);

module.exports = {
	UserHandler,
};
