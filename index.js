const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs").promises;
const port = process.env.PORT || 7000;
const { routes } = require("./routes/routes");
const log = require("./utils/log");

http.createServer(server).listen(port, function () {
	console.log("Server is running on port", port);
});

function server(req, res) {
	const basePath = url.parse(req.url, true).pathname;
	const method = req.method;

	const resolveRoute = routes[method][basePath];

	if (!resolveRoute) {
		const mimes = {
			".css": "text/css",
			".html": "text/html",
			".jpeg": "image/jpeg",
			".png": "image/png",
		};
		const fileExt = path.extname(basePath);
		const fileType = mimes[fileExt] || "text/plain";
		const filePath = path.join(
			__dirname,
			"assets",
			decodeURIComponent(basePath)
		);

		fs.readFile(filePath)
			.then(function (contents) {
				res.writeHead(200, { "content-type": fileType });
				res.end(contents);
			})
			.catch(function (err) {
				res.writeHead(404);
				res.end(`<center><h1>Oops! something happened</h1></center>`);
			});
		return;
	} else {
		resolveRoute(req, res);
	}
}
/**
 * impliment sign in and sign up with the front end
 * make the link tags in html work as it should in directing people
 * protect the dashboard to only logged in user
 *
 * create a reservation dashboard
 * make the serve static files better
 *
 */
