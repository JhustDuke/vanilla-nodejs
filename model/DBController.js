const { UserHandler } = require("./userModel");
const log = require("../utils/log");

function DBController() {
	/**this function adds a new user to the database */
	const addUser = async function ({ email, password, confirm_password }) {
		try {
			const addUser = new UserHandler({ email, password, confirm_password });
			if (await addUser.save()) {
				log(`added ${email} to the database`);
				return true;
			}
		} catch (error) {
			log(`data not added to the database, ${error}`);
			return false;
		}
	};

	/**this functions creates a new user */
	const signIn = async function ({ email, password }) {
		try {
			const signIn = UserHandler.findOne({ email, password });
			if (await signIn) {
				log("welcome ", email.split("@")[0]);
				return true;
			}
		} catch (err) {
			log(err);
			return false;
		}
	};

	/**this function updates the data in a database '
	 * @findDocBy is the search criteria to find the doc that needs updating
	 * @upDateDocTo is the new info replacing the old one
	 */
	const updateData = async function (findDocBy, updateDocTo) {
		try {
			const result = await UserHandler.updateOne(
				findDocBy, // Criteria to find before update
				updateDocTo // Data to be updated
			);

			if (result.nModified > 0) {
				log(`Updated ${updateDocTo.email}`);
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
	};

	/**this function deleletes the data from the userbase
	 * @target is the mongoDb to delete
	 */
	const deleteData = async function deleteData({ target }) {
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
	};

	/**this functions returns everything in our data base */
	const getCollections = async function () {
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
	};

	/**this function checks if a given email exist */
	const ifEmailExist = async function (email) {
		try {
			const checkMail = await UserHandler.findOne({ email });
			if (checkMail) {
				// if this email exist in the database
				return true;
			} else {
				return false;
			}
		} catch (err) {
			console.log(err);
			return false;
		}
	};

	/**this function checks if a password is invalid and returns TRUE  if IT IS
	 * @email is the user email of the password is tied to
	 * @password is the password of the  the provided email
	 */
	const passwordIsInvalid = async function (email, password) {
		try {
			//if the password does not match the email
			const user = await UserHandler.findOne({ email });
			if (user && user.password !== password) {
				return true; // here means the password does not match
			} else {
				return false; // here means the password matches
			}
		} catch (err) {
			console.log(err);
			return false;
		}
	};

	/**____________________________________________________________________________________________________________*/

	return {
		addUser,
		signIn,
		updateData,
		deleteData,
		passwordIsInvalid,
		ifEmailExist,
	};

	/**____________________________________________________________________________________________________________ */
}

//

module.exports = DBController;
