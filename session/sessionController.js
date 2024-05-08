const { log } = require("../utils/utilExports");
const sessionModel = require("./sessionModel");

// when a request hits the server
// the header is searched for a session id
// if ssid is available in the header,
// a query is made to the db to check if the found ssid is avaioable in the db
//if it is, it is checked to see if it has expired expired
// if it has, a res of please login again to continue is sent
// if not a new session doc is created in the db

async function sessionController(req, res) {
	// when a request hits the server
	let sessionId = req.headers.cookie;
	//if no sessionId
	if (!sessionId) {
		return log("no session found by session controller");
	}
	// the header is searched for a session id/tokens
	const sessionTokens = getSessionTokens(sessionId);

	if (!sessionTokens) {
		return log("no matching sessionId found init new session");
	}
	// a query is made to the db to check if a session is availalable
	const queryDb = await querySessionDb(sessionTokens);

	if (!queryDb) {
		//if a session is not availabe, a new one is created
		await createSession(sessionTokens)
			.then(function () {
				log("session created from createSession");
			})
			.catch(function (e) {
				log("sesion not created from createSession");
			});
	} else {
		//if a session is available ,it's checked for the expiration date

		const query = await sessionModel.find({ sessionKey: sessionTokens[0] });
		const expiry = checkExpiration(query.expirationDate);
		//if the expiration date has passed a message is sent please login to continue and a new session is created
		if (!expiry) {
			log("please login to continue from expiry");
		} else {
			log("welcome from expiry");
		}
	}
}

// methods
function checkExpiration(sessionDate) {
	const currentDate = new Date();
	if (currentDate > sessionDate) {
		log("session expired from checkExpiration");
		return false;
	} else {
		log("session is active from checkExpiration");
		return true;
	}
}

async function createSession(sessionToken) {
	const newSession = new sessionModel();
	newSession.sessionKey = sessionToken[0];
	newSession.sessionValue = sessionToken[1];
	try {
		if (await newSession.save()) {
			log("saved successfully from createSession");
			log(newSession);
			return true;
		}
	} catch (e) {
		log("session not saved from createSession", e);
	}
}
async function querySessionDb(sessionToken) {
	try {
		let sessionDoc = await sessionModel.find({
			sessionKey: sessionToken[0],
			sessionValue: sessionToken[1],
		});

		if (sessionDoc.length > 0) {
			//log("sessionDoc found");
			return sessionDoc;
		} else {
			console.log("nothing found from querySessionDb");
			return false;
		}
	} catch (e) {
		log("sessionDoc error from querySessionDb", e);
		return false;
	}
}

function getSessionTokens(ssid) {
	let ss;

	try {
		const session = ssid.trim().split(";");

		for (let i = 0; i < session.length; i++) {
			if (session[i].includes("@home")) {
				let el = session[i].split("=");
				ss = el;
				return ss;
			}
		}
		let objEntries = Object.entries(obj);

		return objEntries.length > 0 ? obj : false;
	} catch (e) {
		log("get session token errors", e);
		return false;
	}
}

module.exports = sessionController;
