const crypto = require("crypto")

module.exports = {
	/**
	 * Create SHA3-512 hash
	 * @param {String} data
	 * @return {String} hashed string
	 */
	generateHash: (data) => {
		const hashed = crypto.createHash("sha512").update(data).digest("base64")

		return hashed
	},
}
