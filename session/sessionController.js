const log = require("../utils/log");
const sessionModel = require("./sessionModel");

// when a request hits the server
// the header is searched for a session id
// if ssid is available in the header,
// a query is made to the db to check if the found ssid is avaioable in the db
//if it is, it is checked to see if it has expired expired
// if it has, a res of please login again to continue is sent
// if not a new session doc is created in the db

function sessionController(req, res) {
	// when a request hits the server
	let sessionId = req.headers.cookie;
	//if no sessionId
	if (!sessionId) {
		return log("no session found by session controller");
	}
	// the header is searched for a session id/tokens
	const getSessionTokens = function (ssid) {
		let ses;

		try {
			const session = ssid.trim().split(";");

			for (let i = 0; i < session.length; i++) {
				if (session[i].includes("@home")) {
					let el = session[i].split("=");
					ses = el;
					log(ss);
					return ss;
				} else {
					log("sesion error from sessionController.getSessionTokens");
					return false;
				}
			}
		} catch (e) {
			log("get session token errors", e);
			return false;
		}
	};

	// a query is made to the db to check if a session is availalable
	const querySessionDb = async function (sessionToken) {
		try {
			let sessionDoc = await sessionModel.find({
				sessionKey: sessionToken[0],
				sessionValue: sessionToken[1],
			});

			if (sessionDoc.length > 0) {
				log("sessionDoc found from querySessionDb");
				return sessionDoc;
			} else {
				console.log("nothing found from querySessionDb");
				return false;
			}
		} catch (e) {
			log("sessionDoc error from querySessionDb", e);
			return false;
		}
	};

	const createSession = async function (sessionToken) {
		const newSession = new sessionModel();
		newSession.sessionKey = sessionToken[0];
		newSession.sessionValue = sessionToken[1];
		try {
			if (await newSession.save()) {
				log("saved successfully from createSession");
				log(newSession);
				return true;
			} else {
				log("session not saved from createSession");
				return false;
			}
		} catch (e) {
			log("session not saved from createSession", e);
		}
	};
	const checkSessionExpiration = async function (userEmail) {
		const currentDate = new Date().toISOString();
		try {
			const doc = await sessionModel.findOne({ userEmail }).exec();
			const dbDate = new Date(doc.expirationDate);
			if (currentDate > dbDate) {
				log("session expired from checkExpiration");
				return false;
			} else {
				log("session is active from checkExpiration");
				return true;
			}
		} catch (e) {
			console.log("there was an error from checkSessionExpiration:", e);
			return false;
		}
	};

	const generateSessionId = function () {
		let str = "zxyABCDEFGH";
		let char = ["#", "@", "$!", "*#"];
		let randomIndex = Math.floor(Math.random() * char.length);
		let joint = char[randomIndex];
		let result =
			Math.random() * str.length + Math.random().toString(36).substring(4);
		result = result.split(".").join(joint, joint);
		return result;
	};

	const generateSessionName = function () {
		const fixed = "@home";
		let randomChar = Math.random().toString(23).substring(2);
		randomChar = randomChar.split(".").join("");
		const outcome = fixed.concat(randomChar);
		let finalStr = toSpecifiedLength(fixed, 23);
		return finalStr;

		function toSpecifiedLength(string, length) {
			let strLength = string.length;
			if (strLength === length) {
				return log("provided string and length are equal");
			}
			const chars = ["|`^+!@#$%^&*³³¤²äåé®þ*"][0].split("");
			let outcome;

			outcome = Math.abs(strLength - length);
			for (let i = 0; i < outcome; i++) {
				let rand = Math.floor(Math.random() * chars.length);
				string += chars[rand];
			}

			return string;
		}
	};

	return {
		getSessionTokens,
		querySessionDb,
		createSession,
		checkSessionExpiration,
		generateSessionId,
		generateSessionName,
	};
}

// methods

module.exports = sessionController;
