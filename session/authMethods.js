const log = require("../utils/log");
// when a request hits the server
// the header is searched for a session id
// if ssid is available in the header,
// a query is made to the db to check if it has expired
// if it has, a res of please login again to continue is sent
// if not a new session doc is created in the db

async function authSessionId({ sessionId }) {
	let id = sessionModel.findOne({ sessionId });
	// if the session id exist,
	if (await id) {
		//check if it has expired
		let expiration = checkExpiration(id.expiration);
		if (!expiration) {
			return log("session expired");
		}
	} else {
		//if the session id does not exist
		console.log("session does not exist log in to get started");
		createNewSessionId({ sessionId });
		return false;
	}
}

function checkExpiration(sessionDate) {
	const currentDate = new Date();
	if (currentDate > sessionDate) {
		log("session expired");
		return false;
	} else {
		log("session is active");
		return true;
	}
}
async function createNewSessionId({ sessionId }) {
	const newSessionId = new sessionModel({ sessionId });
	try {
		if (await newSessionId.save()) {
			log("added a new session");
			return true;
		}
	} catch (e) {
		log("new session not added", e);
		return false;
	}
}
function verifySessionLength(sessionId) {
	if (!sessionId) {
		console.log("session id unavailable");
		return false;
	} else {
		let splitId = sessionId.split("=");

		if (splitId[1].length >= 24 && splitId[1].length <= 28) {
			return splitId[1];
		} else {
			log("id does not meet requirement");
			return false;
		}
	}
}

module.exports = {
	authSessionId,
	verifySessionLength,
	checkExpiration,
	createNewSessionId,
};
