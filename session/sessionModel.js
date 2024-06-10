const mongoose = require("../model/connection");
const sec = 1000;
const min = 60 * sec;
const hour = 60 * min;
const day = 24 * hour;
const week = 7 * day;

const sessionStoreSchema = new mongoose.Schema({
	sessionKey: {
		type: String,
		unique: true,
		required: true,
		validate: {
			// prevent loggin multiple session keys
			validator: function (key) {
				return this.model("sessionStore")
					.findOne({ sessionKey: key })
					.then(function (sessionName) {
						if (sessionName) {
							// if a session with this value already exist
							return false;
						}
						return true;
					});
			},
			message: "session name already exist from",
		},
	},

	sessionValue: {
		type: String,
		unique: true,
		//required: true,
		validate: {
			validator: function (key) {
				return this.model("sessionStore")
					.findOne({ sessionValue: key })
					.then(function (sessionId) {
						if (sessionId) {
							return false;
						}
						return true;
					});
			},
			message: " this sessionId already exist from validator",
		},
	},

	preferences: [String],
	expirationDate: {
		type: String,
		default: function () {
			let sessionTimer = new Date();
			sessionTimer.setHours(sessionTimer.getHours() + 1);
			return sessionTimer.toISOString();
		},
	},
});
const sessionModel = mongoose.model("sessionStore", sessionStoreSchema);

module.exports = sessionModel;
