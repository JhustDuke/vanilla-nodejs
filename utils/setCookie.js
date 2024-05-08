function setCookie({ name, value, HttpOnly = false, path = "/" }) {
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
}

module.exports = setCookie;
