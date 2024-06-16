const qs = require("querystring");
const fs = require("fs").promises;
const path = require("path");
const log=require('../utils/log');
const DBController = require("../model/DBController");

function deleteRequest(req, res) {
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

		let deleteInfo = await DBController.deleteData({ FirstName });

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
module.exports = deleteRequest;
