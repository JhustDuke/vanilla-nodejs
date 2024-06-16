const qs = require("querystring");
const dbController = require("../model/DBController");
const sessionController = require("../session/sessionController");
const cookieController = require("../utils/cookieController");

function postRequestSignUp(req, res) {
	const DBController = dbController();
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
			const addUser = await DBController.addUser({
				email,
				password,
				confirm_password,
			});

			if (addUser) {
				res.writeHead(200, { "content-type": "text/plain" });
				res.end(`${email},  has been added to db`);
			} else if (await DBController.ifEmailExist(email)) {
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
module.exports = postRequestSignUp;
