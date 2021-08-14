const crypto = require("crypto")

module.exports = {
	/**
	 * Create SHA3-512 hash
	 * @param {string} data
	 * @return {string} hashed string
	 */
	generateHash: (data) => {
		const hashed = crypto.createHash("sha512").update(data).digest("base64")

		return hashed
	},
}
