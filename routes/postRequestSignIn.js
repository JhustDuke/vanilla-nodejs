const qs = require("querystring");
const dbController = require("../model/DBController");
const sessionController = require("../session/sessionController");
const cookieController = require("../utils/cookieController");

function postRequestSignIn() {
	const DBController = dbController();
	const signIn = function (req, res) {
		/**oh yeah */
		let body = "";
		req.on("data", function (packets) {
			body += packets;
		});
		req.on("end", async function () {
			const params = qs.parse(body);
			let email = params.email;
			let password = params.password;
			const signIn = await DBController.signIn({ email, password });
			if (
				signIn
			) {
			res.writeHead(200, { "content-type": "text/html" });
			res.end(`welcome @${email.split("@")[0]}`);
		}
			// prettier-ignore
			else if (await DBController.passwordIsInvalid(email, password)) {
				res.writeHead(402);
				res.end("password or email error");
			} else {
				res.writeHead(400);
				res.end(
					`these email: ${email} does not exist in our registry, recheck or sign up instead!`
				);
			}
		});
	};
	return {
		signUp,
		signIn,
	};
}

module.exports = postRequestSignIn;
