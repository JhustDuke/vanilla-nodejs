const path = require("path");
const fs = require("fs").promises;
const log = require("../utils/log");

async function getRequest(req, res) {
	let fileFolder = path.join(__dirname, "../", "assets", "html");
	let filePath = path.join(
		fileFolder,
		req.url === "/" ? "index.html" : req.url + ".html"
	);

	if (req.url === "/dashboard") {
		//
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
module.exports = getRequest;
