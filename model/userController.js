const { UserHandler } = require("./userModel");
const log = require("../utils/log");

async function addUser({ FirstName, LastName, PhoneNumber }) {
	try {
		const addUser = new UserHandler({ FirstName, LastName, PhoneNumber });
		if (await addUser.save()) {
			log(`added ${FirstName} to the database`);
			return true;
		}
	} catch (error) {
		log(`data not added to the database, ${error}`);
		return false;
	}
}

async function SignIn({ PhoneNumber }) {
	try {
		const signIn = UserHandler.findOne({ PhoneNumber });
		if (await signIn) {
			log("welcome ", PhoneNumber);
			return true;
		}
	} catch (err) {
		log(err);
		return false;
	}
}

async function updateData(findDocBy, updateDocTo) {
	try {
		const result = await UserHandler.updateOne(
			findDocBy, // Criteria to find before update
			updateDocTo // Data to be updated
		);

		if (result.nModified > 0) {
			log(`Updated ${updateDocTo.PhoneNumber}`);
			return true;
		} else if (result.n > 0) {
			log(`No changes made. Document found but not modified.`);
			return false;
		} else {
			log(`No matching document found for update.`);
			return false;
		}
	} catch (e) {
		log(e);
		return false;
	}
}

async function deleteData({ target }) {
	try {
		let deleteInfo = await UserHandler.deleteOne({ target });
		if (deleteInfo.deletedCount > 0) {
			log(`${deleteInfo.deletedCount} deleted`);
			return true;
		} else {
			log(`${target} not deleted`);
			return false;
		}
	} catch (e) {
		log(e);
		return false;
	}
}

async function getCollections() {
	try {
		let col = await UserHandler.find();
		if (col.length > 0) {
			log(col);
		} else {
			log("no collections available in USERS");
		}
	} catch (e) {
		log(e);
	}
}
getCollections();
module.exports = { addUser, SignIn, updateData, deleteData };
