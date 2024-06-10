const qs = require("querystring");
const fs = require("fs").promises;
const path = require("path");
const url = require("url");
const usersHandler = require("../model/userController");
const { log, setCookie, clearCookie } = require("../utils/utilExports");
const {
	generateSessionId,
	generateSessionName,
	sessionController,
} = require("../session/sessionExports");

const routes = {
	GET: {
		"/": getRequest,
		"/signin": getRequest,
		"/signup": getRequest,

		"/gallery": getRequest,
		"/dashboard": getRequest,
		"/services": getRequest,
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
};

async function getRequest(req, res) {
	let fileFolder = path.join(__dirname, "../", "assets", "html");
	let filePath = path.join(
		fileFolder,
		req.url === "/" ? "index.html" : req.url + ".html"
	);

	if (req.url === "/dashboard") {
	}

	await fs
		.readFile(filePath)
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

		let email, password, confirm_password;

		email = params.email;
		password = params.password;
		confirm_password = params.confirm_password;

		// check for empty fields
		if (!email || !password || !confirm_password) {
			res.writeHead(400);
			res.end("please provide email, password, confirm password");
			return;
		}
		// check for password errors
		if (password !== confirm_password) {
			res.writeHead(400);
			res.end("password and confirm password error");
		}

		try {
			const addUser = await usersHandler.addUser({
				email,
				password,
				confirm_password,
			});

			if (addUser) {
				res.writeHead(200, { "content-type": "text/plain" });
				res.end(`${email},  has been added to db`);
			} else if (await usersHandler.ifEmailExist(email)) {
				res.writeHead(401);
				res.end("this email already exist sign in instead");
			} else {
				res.writeHead(400);
				res.end(
					`<center> oops we could not sign you up at the moment take a break and try again in 5mins<center/>`
				);
			}
		} catch (e) {
			res.writeHead(404);
			res.end("internal server error", e);
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
		let email = params.email;
		let password = params.password;
		const signIn = await usersHandler.SignIn({ email, password });
		if (
			signIn
		) {
			res.writeHead(200, { "content-type": "text/html" });
			res.end(`welcome @${email.split("@")[0]}`);
		}
		// prettier-ignore
		else if (await usersHandler.passwordIsInvalid(email, password)) {
			res.writeHead(402);
			res.end("password or email error");
		} else {
			res.writeHead(400);
			res.end(
				`these email: ${email} does not exist in our registry, recheck or sign up instead!`
			);
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
