const qs = require("querystring");
const fs = require("fs").promises;
const path = require("path");
const dbController = require("../database/DBController");
const log = require("../utils/log");

function putRequest(req, res) {
	const DBController = dbController();
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

		let updateInfo = await DBController.updateData(
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
module.exports = putRequest;
