function clearCookie({ name }) {
	return function (req, res) {
		let cookies = [`${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`];
		res.setHeader("set-cookie", cookies);
	};
}

module.exports = clearCookie;
