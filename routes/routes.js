const qs = require("querystring");
const fs = require("fs").promises;
const path = require("path");
const url = require("url");
//const usersHandler = require("../model/userController");
const { log, setCookie, clearCookie } = require("../utils/utilExports");
const {
	generateSessionId,
	generateSessionName,
	sessionController,
} = require("../session/sessionExports");

const routes = {
	GET: {
		"/": getRequest,
	},
	POST: {
		"/signup": postSignUp,
		"/signin": postSignIn,
	},
	PUT: {
		"/put": putReq,
	},
	DELETE: {
		"/del": deleteReq,
	},
	loadStatic(paths) {},
};

async function getRequest(req, res) {
	let fileFolder = path.join(__dirname, "../", "assets");
	//log(111, pathName);

	await fs
		.readFile(path.join(fileFolder, "html", "index.html"))
		.then(function (data) {
			res.writeHead(200, { "content-type": "text/html" });
			res.end(data);
		})
		.catch(function (error) {
			res.writeHead(400);
			res.end(error);
		});
}

function postSignUp(req, res) {
	req.on("error", function (err) {
		res.end("there was an error somewhere", err);
	});

	let body = "";
	req.on("data", function (packets) {
		body += packets;
	});

	req.on("end", async function () {
		const params = qs.parse(body);
		let FirstName, LastName, PhoneNumber;

		FirstName = params.FirstName;
		LastName = params.LastName;
		PhoneNumber = 1 * params.PhoneNumber.toString();

		if (!FirstName || !LastName || !PhoneNumber) {
			res.writeHead(400);
			res.end("please provide FirstName, LastName, PhoneNumber");
			return;
		}

		let add = await usersHandler.addUser({
			FirstName,
			LastName,
			PhoneNumber,
		});

		if (add) {
			res.writeHead(200, { "content-type": "text/plain" });
			res.end(`${LastName}, ${FirstName} has been added to db`);
		} else {
			res.writeHead(400);
			res.end("data not to db");
		}
	});
}

function postSignIn(req, res) {
	let body = "";
	req.on("data", function (packets) {
		body += packets;
	});
	req.on("end", async function () {
		const params = qs.parse(body);
		let PhoneNumber = params.PhoneNumber;
		let signIn = await usersHandler.SignIn({ PhoneNumber });
		if (signIn) {
			res.writeHead(200, { "content-type": "text/html" });
			res.end(`welcome ${PhoneNumber}`);
		} else {
			res.writeHead(400);
			res.end(`these number: ${PhoneNumber} does not exist!`);
		}
	});
}

function putReq(req, res) {
	log(req.headers);
	let body = "";
	req.on("data", function (packets) {
		body += packets;
	});

	req.on("end", async function () {
		const params = qs.parse(body);
		let FirstName, LastName, PhoneNumber;

		FirstName = params.FirstName;
		LastName = params.LastName;
		PhoneNumber = params.PhoneNumber;

		let updateInfo = await usersHandler.updateData(
			{ FirstName },
			{ PhoneNumber }
		);

		if (updateInfo) {
			res.writeHead(200, { "content-type": "text/plain" });
			log("updated", PhoneNumber);
			res.end(`updated ${FirstName} phonenumber`);
		} else {
			res.writeHead(400);
			res.end("data not updated");
		}
	});
}

function deleteReq(req, res) {
	weqf3feqzz;
	let body = "";
	req.on("data", function (packets) {
		body += packets;
	});

	req.on("end", async function () {
		const params = qs.parse(body);
		let FirstName, LastName, PhoneNumber;

		FirstName = params.FirstName;
		LastName = params.LastName;
		PhoneNumber = params.PhoneNumber;

		let deleteInfo = await usersHandler.deleteData({ FirstName });

		if (deleteInfo) {
			res.writeHead(200, { "content-type": "text/plain" });
			log("deleted", FirstName);
			res.end(`deleted ${FirstName}`);
		} else {
			res.writeHead(400);
			res.end("data not deleted");
		}
	});
}

module.exports = {
	routes,
};

/**
 * a script that traverses a folder checks for headers and footers and update the components found in the origin
 * i.e e.g in the html folder copy all footers and headers present in index.html(entry file) and apply them in other files with .html ext present in the same folder
 *
 */
