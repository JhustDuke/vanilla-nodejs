const log = require("../utils/log");
const getRequest = require("./getRequest");
const postRequestSignUp = require("./postRequestSignUp");
const postRequestSignIn = require("./postRequestSignIn");
const putRequest = require("./putRequest");
const deleteRequest = require("./deleteRequest");

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
		"/signup": postRequestSignUp,
		"/signin": postRequestSignIn,
	},
	PUT: {
		"/put": putRequest,
	},
	DELETE: {
		"/del": deleteRequest,
	},
};

module.exports = {
	routes,
};

/**
 * a script that traverses a folder checks for headers and footers and update the components found in the origin
 * i.e e.g in the html folder copy all footers and headers present in index.html(entry file) and apply them in other files with .html ext present in the same folder
 *
 */
