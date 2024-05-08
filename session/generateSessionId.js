function generateSessionId() {
	let str = "zxyABCDEFGH";
	let char = ["#", "@", "$!", "*#"];
	let randomIndex = Math.floor(Math.random() * char.length);
	let joint = char[randomIndex];
	let result =
		Math.random() * str.length + Math.random().toString(36).substring(4);
	result = result.split(".").join(joint, joint);
	return result;
}

function generateSessionName() {
	const fixed = "@home";
	let randomChar = Math.random().toString(23).substring(2);
	randomChar = randomChar.split(".").join("");
	const outcome = fixed.concat(randomChar);
	let finalStr = toSpecifiedLength(fixed, 23);
	return finalStr;

	function toSpecifiedLength(string, length) {
		let strLength = string.length;
		if (strLength === length) {
			return log("provided string and length are equal");
		}
		const chars = ["|`^+!@#$%^&*³³¤²äåé®þ*"][0].split("");
		let outcome;

		outcome = Math.abs(strLength - length);
		for (let i = 0; i < outcome; i++) {
			let rand = Math.floor(Math.random() * chars.length);
			string += chars[rand];
		}

		return string;
	}
}
module.exports = { generateSessionId, generateSessionName };
