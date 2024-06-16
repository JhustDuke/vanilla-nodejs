/**hurray */
function cookieController() {
	const clearCookie = function ({ name }) {
		return function (req, res) {
			let cookies = [`${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`];
			res.setHeader("set-cookie", cookies);
		};
	};

	const setCookie = function ({ name, value, HttpOnly = false, path = "/" }) {
		if (!name || !value) {
			return console.log("session name and value is required");
		} else {
			return function (req, res) {
				let cookies = [`${name}=${value}; path=${path};`];
				if (HttpOnly) {
					cookies.push("HttpOnly;");
				}

				cookies = cookies.join(";");

				res.setHeader("set-cookie", cookies);
			};
		}
	};

	return {
		setCookie,
		clearCookie,
	};
}
module.exports = cookieController;
