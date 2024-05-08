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

	//serveStatic({ routesObj: resolveRoute, pathname: basePath, res });
	//readFileAndProcess({ pathname: basePath, res: res });

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
				if (path.extname(filePath) === ".ico") {
				} else {
					res.writeHead(200, { "content-type": fileType });
					res.end(contents);
				}
			})
			.catch(function (err) {
				log(err);
				res.writeHead(404);
				res.end(`<center><h1>Oops! File not found</h1></center>`);
			});
		return;
	}

	if (resolveRoute) {
		resolveRoute(req, res);
	} else {
		res.writeHead(404);
		res.end(`<center><h1>Oops! Something went wrong</h1></center>`);
	}
}

function serveStatic({ routesObj, pathname, res }) {
	if (!routesObj) {
		const mimes = {
			".css": "text/css",
			".html": "text/html",
			".jpeg": "image/jpeg",
			".png": "image/png",
		};
		const fileExt = path.extname(pathname);
		const fileType = mimes[fileExt];
		const filePath = path.join(
			__dirname,
			"assets",
			decodeURIComponent(pathname)
		);

		fs.readFile(filePath)
			.then(function (data) {
				if (data.endsWith(".ico")) {
					return;
				} else {
					res.writeHead(200, { "content-type": fileType });
					res.end(data);
				}
			})
			.catch(function (error) {
				log("there was an error", error);
			});
	}
}
function serveStaticFile({ basePath, res }) {
	const mimes = {
		".css": "text/css",
		".html": "text/html",
		".jpeg": "image/jpeg",
		".png": "image/png",
	};

	const fileExt = path.extname(basePath);
	const fileType = mimes[fileExt] || "text/plain";
	const filePath = path.join(__dirname, "assets", decodeURIComponent(basePath));

	fs.readFile(filePath)
		.then(function (contents) {
			if (path.extname(filePath) === ".ico") {
				// Do nothing for .ico files
			} else {
				res.writeHead(200, { "content-type": fileType });
				res.end(contents);
			}
		})
		.catch(function (error) {
			console.error("Error reading file:", error);
			res.writeHead(404);
			res.end(`<center><h1>Oops! File not found</h1></center>`);
		});
}
